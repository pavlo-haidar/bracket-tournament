import { Test, TestingModule } from '@nestjs/testing';
import { TournamentController } from './tournament.controller';
import { TournamentService } from './tournament.service';

describe('TournamentController', () => {
  let controller: TournamentController;

  const mockTournamentService = {
    getTournamentInfo: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TournamentController],
      providers: [TournamentService],
    })
      .overrideProvider(TournamentService)
      .useValue(mockTournamentService)
      .compile();

    controller = module.get<TournamentController>(TournamentController);
  });

  it('should be called: submitScore', () => {
    controller.getTournamentInfo(null);
    expect(mockTournamentService.getTournamentInfo).toHaveBeenCalled();
  });
});
