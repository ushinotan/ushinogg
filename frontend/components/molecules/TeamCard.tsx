import {Player} from "game";
import {Badge, Button, Card} from "@chakra-ui/react";
import {TeamPlayerItem} from "@/components/molecules/TeamPlayerItem";
import {Trophy} from "lucide-react";

interface TeamCardProps {
  teamName: string;
  players: Player[];
  teamColor: 'blue' | 'red';
  onWin: () => void;
}

export function TeamCard({ teamName, players, teamColor, onWin }: TeamCardProps) {
  const colorClasses = {
    blue: {
      gradient: 'bg-gradient-to-br from-blue-900/40 to-blue-800/20',
      border: 'border-blue-600/50',
      title: 'text-blue-300 font-semibold text-lg',
    },
    red: {
      gradient: 'bg-gradient-to-br from-red-900/40 to-red-800/20',
      border: 'border-red-600/50',
      title: 'text-red-300 font-semibold text-lg',
    },
  };

  const colors = colorClasses[teamColor];

  return (
    <Card.Root className={`p-4 ${colors.gradient} ${colors.border}`}>
      <Card.Header className="flex justify-between items-center">
        <h3 className={colors.title}>{teamName}</h3>
        <Badge
          colorScheme={teamColor}
          variant="solid"
          size="sm"
        >
          {players.length}人
        </Badge>
      </Card.Header>
      <Card.Body className="space-y-2 mb-3">
        {players.map((player, index) => (
          <TeamPlayerItem
            key={player.id}
            player={player}
            index={index}
            teamColor={teamColor}
          />
        ))}
      </Card.Body>
      <Card.Footer>
        <Button
          onClick={onWin}
          colorScheme={teamColor}
          size="lg"
          width="full"
          aria-label={`${teamName}チームの勝利を記録`}
        >
          <Trophy className="w-4 h-4 mr-2" />
          {teamName}勝利
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}
