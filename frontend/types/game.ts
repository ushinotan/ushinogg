declare module 'game' {
  export interface Player {
    id: string;
    name: string;
    rank?: string;
    mmr?: number;
  }

  export interface GameRecord {
    id: string;
    date: Date;
    blueTeam: Player[];
    redTeam: Player[];
    winner: 'blue' | 'red';
  }

  export type Rank =
      | 'Iron' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'
      | 'Master' | 'Grandmaster' | 'Challenger'

  export type Division = 'IV' | 'III' | 'II' | 'I'

  export type RankMMR = {
    rank: Rank
    division?: Division
    baseMmr: number
  }
}
