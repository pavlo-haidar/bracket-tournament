import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Match, MatchDocument } from 'src/schemas/match.schema';

@Injectable()
export class TournamentService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
  ) {}

  async getTournamentInfo(id: string) {
    const finalMatch = await this.matchModel
      .findOne({ tournament: id, nextMatch: null })
      .exec();

    return this.buildTournamentGrid(finalMatch);
  }

  private async buildTournamentGrid(match: MatchDocument) {
    const previousRoundMatches = await this.matchModel
      .find({ nextMatch: match })
      .exec();

    const previousRound = await Promise.all(
      previousRoundMatches.map(this.buildTournamentGrid.bind(this)),
    );

    return {
      ...match.toObject(),
      previousRound,
    };
  }
}
