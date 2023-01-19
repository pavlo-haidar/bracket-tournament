import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MatchService } from './match.service';
import { Match } from 'src/schemas/match.schema';
import { Tournament } from 'src/schemas/tournament.schema';
import {
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';

const matches = () => [
  {
    _id: 'match1',
    tournament: 'tournament1',
    player1: 'player1',
    player2: 'player2',
    player1Score: 477,
    player2Score: null,
    nextMatch: 'match3',
    save: jest.fn(),
  },
  {
    _id: 'match2',
    tournament: 'tournament1',
    player1: 'player3',
    player2: 'player4',
    player1Score: null,
    player2Score: 777,
    nextMatch: 'match4',
    save: jest.fn(),
  },
  {
    _id: 'match3',
    tournament: 'tournament1',
    player1: null,
    player2: null,
    player1Score: null,
    player2Score: null,
    nextMatch: null,
    save: jest.fn(),
  },
  {
    _id: 'match4',
    tournament: 'tournament1',
    player1: 'player3',
    player2: null,
    player1Score: null,
    player2Score: null,
    nextMatch: null,
    save: jest.fn(),
  },
  {
    _id: 'match5',
    tournament: 'tournament1',
    player1: 'player2',
    player2: 'player4',
    player1Score: 474,
    player2Score: null,
    nextMatch: null,
    save: jest.fn(),
  },
];

describe('MatchService', () => {
  let service: MatchService;

  const mockMatchModel = {
    findById: (id) => matches().find((match) => match._id === id),
  };

  const mockTournamentModel = {
    updateOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        {
          provide: getModelToken(Match.name),
          useValue: mockMatchModel,
        },
        {
          provide: getModelToken(Tournament.name),
          useValue: mockTournamentModel,
        },
      ],
    }).compile();

    service = module.get<MatchService>(MatchService);
  });

  it(`shouldn't submit score: no score provided`, async () => {
    try {
      await service.submitScore('match1', 'player1', null);
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntityException);
    }
  });

  it(`shouldn't submit score: no match provided`, async () => {
    try {
      await service.submitScore(null, 'player1', 4);
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntityException);
    }
  });

  it(`should submit score: update player2 score`, async () => {
    const result = await service.submitScore('match1', 'player2', 744);

    expect(result.player2Score).toBe(744);
  });

  it(`should submit score: update player1 score`, async () => {
    const result = await service.submitScore('match2', 'player3', 444);

    expect(result.player1Score).toBe(444);
  });

  it(`shouldn't submit score: score was submitted before`, async () => {
    try {
      await service.submitScore('match1', 'player1', 4);
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
    }
  });

  it(`should close tournament: submit score in final match`, async () => {
    const result = await service.submitScore('match5', 'player4', 747);

    expect(mockTournamentModel.updateOne).toBeCalled();
    expect(result.player1Score).toBe(474);
    expect(result.player2Score).toBe(747);
  });
});
