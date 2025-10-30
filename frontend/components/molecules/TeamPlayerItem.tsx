import {Player} from "game";
import {Badge} from "@chakra-ui/react";

interface TeamPlayerItemProps {
  player: Player;
  index: number;
  teamColor: 'blue' | 'red';
}

export function TeamPlayerItem({ player, index, teamColor }: TeamPlayerItemProps) {
  const colorClasses = {
    blue: {
      container: 'bg-blue-950/30 border-blue-700/30',
      bg: 'bg-blue-600',
      text: 'text-blue-100'
    },
    red: {
      container: 'bg-red-950/30 border-red-700/30',
      bg: 'bg-red-600',
      text: 'text-red-100'
    },
  };

  const colors = colorClasses[teamColor];

  return (
    <div
      className={`flex items-center gap-3 p-2 ${colors.container} rounded border`}
    >
      <div
        className={`flex items-center justify-center w-6 h-6 rounded-full ${colors.bg} text-white text-sm font-medium`}
        aria-label={`プレイヤー ${index + 1}番`}
      >
        {index + 1}
      </div>
      <span className={`${colors.text} flex-1 font-medium`}>{player.name}</span>
      {player.rank && (
        <Badge
          variant="outline"
          colorScheme={teamColor}
          size="sm"
        >
          {player.rank}
        </Badge>
      )}
    </div>
  );
}
