import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Player, PlayerDocument } from 'src/schemas/player.schema';
import { PlayerDto } from './dto';
import { Tournament, TournamentDocument } from 'src/schemas/tournament.schema';
import { Match, MatchDocument } from 'src/schemas/match.schema';

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
    @InjectModel(Tournament.name)
    private tournamentModel: Model<TournamentDocument>,
  ) {}

  createPlayer(data: PlayerDto): Promise<Player> {
    const createdPlayer = new this.playerModel(data);

    return createdPlayer.save();
  }

  getAllPlayers(): Promise<Player[]> {
    return this.playerModel.find().exec();
  }

  getPlayer(id: string): Promise<Player> {
    return this.playerModel.findById(id).exec();
  }

  async joinTournament(playerId: string, size: number): Promise<Match> {
    const player = await this.playerModel.findById(playerId);
    let availableMatch = await this.matchModel
      .findOne({
        round: 1,
        $or: [{ player1: null }, { player2: null }],
        $and: [
          { player1: { $ne: new Types.ObjectId(playerId) } },
          { player2: { $ne: new Types.ObjectId(playerId) } },
        ],
      })
      .exec();
    const matchInTheSameTournamentWithThisPlayer = await this.matchModel
      .findOne({
        tournament: availableMatch?.tournament,
        $or: [{ player1: player }, { player2: player }],
      })
      .exec();
    if (!availableMatch || matchInTheSameTournamentWithThisPlayer) {
      const tournament = await this.generateTournament(size);
      availableMatch = await this.matchModel
        .findOne({ tournament, round: 1 })
        .exec();
    }

    if (!availableMatch.player1) {
      availableMatch.player1 = player;
    } else {
      availableMatch.player2 = player;
    }
    await availableMatch.save();

    return availableMatch;
  }

  private async generateTournament(
    size: number,
    tournament: Tournament = null,
    nextMatch: Match = null,
  ): Promise<Tournament> {
    if (size === 1) {
      return tournament;
    }

    if (!tournament) {
      const createdTournament = new this.tournamentModel({ size });
      tournament = await createdTournament.save();
    }

    const round = Math.ceil(Math.log2(size));
    const match = new this.matchModel({ round, nextMatch, tournament });
    await match.save();

    if (round > 1) {
      await this.generateTournament(Math.floor(size / 2), tournament, match);
      await this.generateTournament(Math.ceil(size / 2), tournament, match);
    }

    return tournament;
  }
}
