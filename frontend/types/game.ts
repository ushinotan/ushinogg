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
}
