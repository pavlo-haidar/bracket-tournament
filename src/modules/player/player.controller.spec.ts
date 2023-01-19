import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';

describe('PlayerController', () => {
  let controller: PlayerController;

  const mockPlayerService = {
    createPlayer: jest.fn(),
    getAllPlayers: jest.fn(),
    getPlayer: jest.fn(),
    joinTournament: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [PlayerService],
    })
      .overrideProvider(PlayerService)
      .useValue(mockPlayerService)
      .compile();

    controller = module.get<PlayerController>(PlayerController);
  });

  it('should be called: createPlayer', () => {
    controller.createPlayer(null);
    expect(mockPlayerService.createPlayer).toBeCalled();
  });

  it('should be called: getAllPlayers', () => {
    controller.getAllPlayers();
    expect(mockPlayerService.getAllPlayers).toBeCalled();
  });

  it('should be called: getPlayer', () => {
    controller.getPlayer(null);
    expect(mockPlayerService.getPlayer).toBeCalled();
  });

  it('should be called: joinTournament', () => {
    controller.joinTournament(null, null);
    expect(mockPlayerService.joinTournament).toBeCalled();
  });
});
