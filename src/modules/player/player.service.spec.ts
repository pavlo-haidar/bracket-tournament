import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Match } from 'src/schemas/match.schema';
import { Player } from 'src/schemas/player.schema';
import { Tournament } from 'src/schemas/tournament.schema';
import { PlayerService } from './player.service';

const players = [
  {
    _id: '63c95c294e0618f7437a8316',
    name: 'Player1',
  },
  {
    _id: '63c95c444e0618f7437a831c',
    name: 'Player2',
  },
  {
    _id: '63c997bc28f9fff8c2abb9e0',
    name: 'Player3',
  },
  {
    _id: '63c997bc28f9fff8c2abb9e2',
    name: 'Player4',
  },
];

const matches = [
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

const tournament = {
  _id: 'tournament1',
  size: 8,
  status: 'OPEN',
};

describe('PlayerService', () => {
  let service: PlayerService;

  class MockPlayerModel {
    constructor() {
      return {
        save: () => null,
      };
    }
    static find = () => ({
      exec: () => players,
    });
    static findById = (id) => ({
      exec: () => players.find((player) => player._id === id),
    });
  }

  class MockMatchModel {
    constructor() {
      return {
        save: () => matches[0],
      };
    }
    static findOne = ({ round, tournament }) => ({
      exec: () => {
        if (round === 1) {
          return matches[0];
        }

        if (tournament) {
          return matches[1];
        }

        return null;
      },
    });
  }

  class MockTournamentModel {
    constructor() {
      return {
        save: () => tournament,
      };
    }
    static find = () => ({
      exec: () => players,
    });
    static findById = (id) => ({
      exec: () => players.find((player) => player._id === id),
    });
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: getModelToken(Player.name),
          useValue: MockPlayerModel,
        },
        {
          provide: getModelToken(Match.name),
          useValue: MockMatchModel,
        },
        {
          provide: getModelToken(Tournament.name),
          useValue: MockTournamentModel,
        },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
  });

  it('should create player', async () => {
    const result = await service.createPlayer(null);
    expect(result).toBeNull();
  });

  it('should return all players', async () => {
    const result = await service.getAllPlayers();
    expect(result).toBe(players);
  });

  it('should return specific player', async () => {
    const result = await service.getPlayer('63c95c444e0618f7437a831c');
    expect(result.name).toBe('Player2');
  });

  it('should join new tournament: user exists in tournament', async () => {
    const result = await service.joinTournament('63c95c294e0618f7437a8316', 8);
    expect(result).toBe(matches[0]);
  });

  it('should join new tournament: user exists in tournament, specific tournament size', async () => {
    const result = await service.joinTournament('63c95c294e0618f7437a8316', 3);
    expect(result).toBe(matches[0]);
  });
});
