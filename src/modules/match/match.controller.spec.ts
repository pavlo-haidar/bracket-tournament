import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

describe('MatchController', () => {
  let controller: MatchController;

  const mockMatchService = {
    submitScore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [MatchService],
    })
      .overrideProvider(MatchService)
      .useValue(mockMatchService)
      .compile();

    controller = module.get<MatchController>(MatchController);
  });

  it('should be called: submitScore', () => {
    controller.submitScore(null, null, null);
    expect(mockMatchService.submitScore).toHaveBeenCalled();
  });
});
