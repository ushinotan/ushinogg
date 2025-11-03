import {Trophy} from "lucide-react";
import clsx from "clsx";
import {Badge} from "@/components/atom";

interface Player {
  id: string;
  name: string;
  rank?: string;
}

interface GameTeamResultProps {
  teamName: string;
  players: Player[];
  teamColor: 'blue' | 'red';
  isWinner: boolean;
}

// Displays the result for a game team, including team name, players, and winner status.
export default function GameTeamResult({
  teamName,
  players,
  teamColor,
  isWinner,
}: GameTeamResultProps) {
  const colorClasses = {
    blue: {
      bg: isWinner ? 'bg-blue-950/40' : 'bg-blue-950/20',
      border: isWinner ? 'border-blue-600/50' : 'border-blue-700/30',
      title: 'text-blue-300 font-medium',
      playerBg: 'bg-blue-950/30',
      playerName: 'text-blue-100',
      playerRank: 'text-blue-400',
    },
    red: {
      bg: isWinner ? 'bg-red-950/40' : 'bg-red-950/20',
      border: isWinner ? 'border-red-600/50' : 'border-red-700/30',
      title: 'text-red-300 font-medium',
      playerBg: 'bg-red-950/30',
      playerName: 'text-red-100',
      playerRank: 'text-red-400',
    },
  };

  const colors = colorClasses[teamColor];

  return (
    <div className={clsx('p-3 rounded-lg border', colors.bg, colors.border)}>
      <div className="flex items-center justify-between mb-2">
        <h4 className={clsx(colors.title, 'flex items-center gap-2')}>
          {teamName}
          {isWinner && <Trophy className="size-4 text-yellow-400" />}
        </h4>
        <Badge variant={isWinner ? 'yellow' : 'slate'} size="sm">
          {players.length}人
        </Badge>
      </div>
      <div className="space-y-1">
        {players.map((player) => (
          <div
            key={player.id}
            className={clsx('flex items-center justify-between text-sm p-1.5 rounded', colors.playerBg)}
          >
            <span className={colors.playerName}>{player.name}</span>
            {player.rank && (
              <span className={clsx(colors.playerRank, 'text-xs')}>
                {player.rank}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

