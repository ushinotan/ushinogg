import {Badge, Card} from "@chakra-ui/react";
import {JSX} from "react";
import GameTeamResult from "@/components/molecules/GameTeamResult";
import {GameRecord} from "@/types/game";

interface GameHistoryItemProps {
  game: GameRecord;
  gameNumber: number;
}

export default function GameHistoryItem({ game, gameNumber }: GameHistoryItemProps) : JSX.Element {

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  return (
      <Card.Root className="p-4 bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
        <Card.Body>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              {formatDate(game.date)}
            </div>
            <Badge className="bg-slate-700 text-slate-300">#{gameNumber}</Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <GameTeamResult
                teamName="ブルーチーム"
                players={game.blueTeam}
                teamColor="blue"
                isWinner={game.winner === 'blue'}
            />
            <GameTeamResult
                teamName="レッドチーム"
                players={game.redTeam}
                teamColor="red"
                isWinner={game.winner === 'red'}
            />
          </div>
        </Card.Body>
      </Card.Root>
  );
}
