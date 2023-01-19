import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { Player } from './player.schema';
import { Tournament } from './tournament.schema';

export type MatchDocument = HydratedDocument<Match>;

@Schema()
export class Match {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tournament' })
  tournament: Tournament;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Player' })
  player1: Player;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Player' })
  player2: Player;

  @Prop()
  player1Score: number;

  @Prop()
  player2Score: number;

  @Prop()
  round: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Match' })
  nextMatch: Match;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
