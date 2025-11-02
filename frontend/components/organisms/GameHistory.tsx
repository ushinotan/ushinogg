import { memo } from 'react';
import { Badge } from '@chakra-ui/react'; 
import { Trophy } from 'lucide-react';
import GameHistoryItem from '@/components/molecules/GameHistoryItem';
import type { GameRecord } from '@/types/game';

interface GameHistoryProps {
  gameHistory: GameRecord[];
}

export const GameHistory = memo(({ gameHistory }: GameHistoryProps) => {
  if (gameHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy 
          className="size-16 text-slate-600 mx-auto mb-4 opacity-30" 
          aria-hidden="true"
        />
        <h3 className="text-slate-400 mb-2">まだ試合履歴がありません</h3>
        <p className="text-slate-500 text-sm">
          チームを作成して勝敗を記録すると、ここに表示されます
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-slate-200 flex items-center gap-2">
          <Trophy 
            className="size-5 text-yellow-500" 
            aria-hidden="true"
          />
          試合履歴
        </h2>
        <Badge colorScheme="gray" variant="subtle">
          {gameHistory.length}試合
        </Badge>
      </div>

      <div className="space-y-4">
        {gameHistory.map((game, index) => (
          <GameHistoryItem
            key={game.id}
            game={game}
            gameNumber={gameHistory.length - index}
          />
        ))}
      </div>
    </div>
  );
});

GameHistory.displayName = 'GameHistory';
