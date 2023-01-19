import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Match } from 'src/schemas/match.schema';
import { TournamentService } from './tournament.service';

const matches = [
  {
    _id: 'match1',
    tournament: 'tournament1',
    player1: 'player1',
    player2: 'player2',
    player1Score: 477,
    player2Score: 744,
    nextMatch: 'match3',
    toObject: function () {
      return this;
    },
    save: jest.fn(),
  },
  {
    _id: 'match2',
    tournament: 'tournament1',
    player1: 'player3',
    player2: 'player4',
    player1Score: 444,
    player2Score: 777,
    nextMatch: 'match3',
    toObject: function () {
      return this;
    },
    save: jest.fn(),
  },
  {
    _id: 'match3',
    tournament: 'tournament1',
    player1: 'player2',
    player2: 'player4',
    player1Score: 474,
    player2Score: 747,
    nextMatch: null,
    toObject: function () {
      return this;
    },
    save: jest.fn(),
  },
];

describe('TournamentService', () => {
  let service: TournamentService;

  const mockMatchModel = {
    findOne: () => ({
      exec: () => matches.find((match) => match.nextMatch === null),
    }),
    find: ({ nextMatch }) => ({
      exec: () => matches.filter((match) => match.nextMatch === nextMatch._id),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TournamentService,
        {
          provide: getModelToken(Match.name),
          useValue: mockMatchModel,
        },
      ],
    }).compile();

    service = module.get<TournamentService>(TournamentService);
  });

  it('should return tournament grid', async () => {
    const result = await service.getTournamentInfo('tournament1');
    expect(result._id).toBe('match3');
  });
});
