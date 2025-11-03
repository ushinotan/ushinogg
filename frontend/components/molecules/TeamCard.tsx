import {Player} from "@/types/game";
import {TeamPlayerItem} from "@/components/molecules/TeamPlayerItem";
import {Trophy} from "lucide-react";
import {Badge, Button, Card} from "@/components/atom";

interface TeamCardProps {
  teamName: string;
  players: Player[];
  teamColor: 'blue' | 'red';
  onWin: () => void;
}

export function TeamCard({ teamName, players, teamColor, onWin }: TeamCardProps) {
  const colorClasses = {
    blue: {
      title: 'text-blue-300 font-semibold text-lg',
    },
    red: {
      title: 'text-red-300 font-semibold text-lg',
    },
  };

  const colors = colorClasses[teamColor];

  return (
    <Card variant={teamColor}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={colors.title}>{teamName}</h3>
        <Badge variant={teamColor}>
          {players.length}人
        </Badge>
      </div>
      
      <div className="space-y-2 mb-4">
        {players.map((player, index) => (
          <TeamPlayerItem
            key={player.id}
            player={player}
            index={index}
            teamColor={teamColor}
          />
        ))}
      </div>
      
      <Button
        onClick={onWin}
        variant={teamColor}
        fullWidth
        icon={<Trophy className="w-5 h-5" />}
        aria-label={`${teamName}チームの勝利を記録`}
      >
        {teamName}勝利
      </Button>
    </Card>
  );
}
