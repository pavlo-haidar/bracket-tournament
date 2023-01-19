import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlayerDto } from './dto';
import { PlayerService } from './player.service';

@Controller('players')
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Post()
  createPlayer(@Body() data: PlayerDto) {
    return this.playerService.createPlayer(data);
  }

  @Get()
  getAllPlayers() {
    return this.playerService.getAllPlayers();
  }

  @Get('/:id')
  getPlayer(@Param('id') id: string) {
    return this.playerService.getPlayer(id);
  }

  @Get('/:id/join-tournament')
  joinTournament(@Param('id') playerId: string, @Body('size') size: number) {
    return this.playerService.joinTournament(playerId, size);
  }
}
