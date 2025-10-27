import {Badge} from "@chakra-ui/react";
import {Trophy} from "lucide-react";

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

// TypeScript
export default function GameTeamResult({
  teamName,
  players,
  teamColor,
  isWinner,
}: GameTeamResultProps)  {
  const colorClasses = {
    blue: {
      bg: isWinner ? 'bg-blue-950/40' : 'bg-blue-950/20',
      border: isWinner ? 'border-blue-600/50' : 'border-blue-700/30',
      title: 'text-blue-300',
      playerBg: 'bg-blue-950/30',
      playerName: 'text-blue-100',
      playerRank: 'text-blue-400',
      badge: isWinner ? 'bg-yellow-600 text-white' : 'bg-blue-800/50 text-blue-300',
    },
    red: {
      bg: isWinner ? 'bg-red-950/40' : 'bg-red-950/20',
      border: isWinner ? 'border-red-600/50' : 'border-red-700/30',
      title: 'text-red-300',
      playerBg: 'bg-red-950/30',
      playerName: 'text-red-100',
      playerRank: 'text-red-400',
      badge: isWinner ? 'bg-yellow-600 text-white' : 'bg-red-800/50 text-red-300',
    },
  };

  const colors = colorClasses[teamColor];

  return (
    <div className={`p-3 rounded-lg border ${colors.bg} ${colors.border}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className={`${colors.title} flex items-center gap-2`}>
          {teamName}
          {isWinner && <Trophy className="size-4 text-yellow-400" />}
        </h4>
        <Badge className={colors.badge}>{players.length}人</Badge>
      </div>
      <div className="space-y-1">
        {players.map((player) => (
            <div
                key={player.id}
                className={`flex items-center justify-between text-sm p-1.5 rounded ${colors.playerBg}`}
            >
              <span className={colors.playerName}>{player.name}</span>
              {player.rank && (
                  <span className={`${colors.playerRank} text-xs`}>
              {player.rank}
            </span>
              )}
            </div>
        ))}
      </div>
    </div>
  );
}

