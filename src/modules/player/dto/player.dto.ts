import { IsNotEmpty } from 'class-validator';

export class PlayerDto {
  @IsNotEmpty()
  name: string;
}
