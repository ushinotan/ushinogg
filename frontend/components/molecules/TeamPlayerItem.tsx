import {Player} from "@/types/game";
import {NumberBadge, Badge} from "@/components/atom";

interface TeamPlayerItemProps {
  player: Player;
  index: number;
  teamColor: 'blue' | 'red';
}

export function TeamPlayerItem({ player, index, teamColor }: TeamPlayerItemProps) {
  const colorClasses = {
    blue: {
      container: 'bg-blue-950/30 border-blue-700/30',
      text: 'text-blue-100',
      badge: 'border-blue-500 text-blue-300'
    },
    red: {
      container: 'bg-red-950/30 border-red-700/30',
      text: 'text-red-100',
      badge: 'border-red-500 text-red-300'
    },
  };

  const colors = colorClasses[teamColor];

  return (
    <div
      className={`flex items-center gap-3 p-2 ${colors.container} rounded border`}
    >
      <NumberBadge 
        number={index + 1} 
        variant={teamColor}
        aria-label={`プレイヤー ${index + 1}番`}
      />
      <span className={`${colors.text} flex-1 font-medium`}>{player.name}</span>
      {player.rank && (
        <Badge size="sm" className={colors.badge}>
          {player.rank}
        </Badge>
      )}
    </div>
  );
}
