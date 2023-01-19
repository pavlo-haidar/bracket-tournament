import { Body, Controller, Param, Post } from '@nestjs/common';
import { MatchService } from './match.service';

@Controller('matches')
export class MatchController {
  constructor(private matchService: MatchService) {}

  @Post('/:matchId/players/:playerId/submit-score')
  submitScore(
    @Param('matchId') matchId: string,
    @Param('playerId') playerId: string,
    @Body('score') score: number,
  ) {
    return this.matchService.submitScore(matchId, playerId, score);
  }
}
