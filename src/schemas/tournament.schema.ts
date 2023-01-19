import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TournamentStatus } from 'src/types';

export type TournamentDocument = HydratedDocument<Tournament>;

@Schema()
export class Tournament {
  @Prop({ required: true })
  size: number;

  @Prop({
    type: String,
    enum: [TournamentStatus.OPEN, TournamentStatus.CLOSED],
    default: TournamentStatus.OPEN,
  })
  status: string;
}

export const TournamentSchema = SchemaFactory.createForClass(Tournament);
