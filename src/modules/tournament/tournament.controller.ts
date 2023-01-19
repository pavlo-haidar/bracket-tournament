import { Controller, Get, Param } from '@nestjs/common';
import { TournamentService } from './tournament.service';

@Controller('tournaments')
export class TournamentController {
  constructor(private tournamentService: TournamentService) {}

  @Get(':id')
  getTournamentInfo(@Param('id') id: string) {
    return this.tournamentService.getTournamentInfo(id);
  }
}
