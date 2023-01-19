import { Model } from 'mongoose';
import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Match, MatchDocument } from 'src/schemas/match.schema';
import { Tournament, TournamentDocument } from 'src/schemas/tournament.schema';
import { TournamentStatus } from 'src/types';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
    @InjectModel(Tournament.name)
    private tournamentModel: Model<TournamentDocument>,
  ) {}

  async submitScore(
    matchId: string,
    playerId: string,
    score: number,
  ): Promise<Match> {
    const match = await this.matchModel.findById(matchId);
    if (!score || !match) {
      throw new UnprocessableEntityException();
    }

    if (match?.player1?.toString() === playerId && !match?.player1Score) {
      match.player1Score = score;
    } else if (
      match?.player2?.toString() === playerId &&
      !match?.player2Score
    ) {
      match.player2Score = score;
    } else {
      throw new ForbiddenException();
    }
    await match.save();

    const { player1Score, player2Score } = match;
    if (player1Score && player2Score && match.nextMatch) {
      const nextMatch = await this.matchModel.findById(match.nextMatch);
      // TODO: handle draw, not is scope
      const winner =
        player1Score > player2Score ? match.player1 : match.player2;
      if (!nextMatch.player1) {
        nextMatch.player1 = winner;
      } else {
        nextMatch.player2 = winner;
      }

      await nextMatch.save();
    }

    if (!match.nextMatch && match.player1Score && match.player2Score) {
      await this.tournamentModel.updateOne(
        { _id: match.tournament },
        { $set: { status: TournamentStatus.CLOSED } },
      );
    }

    return match;
  }
}
