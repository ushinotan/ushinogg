import { PlayerListHeader } from '../molecules/PlayerListHeader';
import { PlayerListItem } from '../molecules/PlayerListItem';
import { PlayerListFooter } from '../molecules/PlayerListFooter';
import { Container } from '../atom';
import type { Player, RankMMR } from '@/types/game';

interface PlayerSelectionProps {
  allPlayers: Player[];
  selectedPlayerIds: Set<string>;
  onTogglePlayer: (playerId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onUpdateRank: (playerId: string, rank: RankMMR) => void;
}

export function PlayerSelection({
  allPlayers,
  selectedPlayerIds,
  onTogglePlayer,
  onSelectAll,
  onDeselectAll,
  onUpdateRank,
}: PlayerSelectionProps) {
  return (
    <Container>
      <PlayerListHeader onSelectAll={onSelectAll} onDeselectAll={onDeselectAll} />

      <div className="space-y-2 my-4">
        {allPlayers.map((player) => (
          <PlayerListItem
            key={player.id}
            player={player}
            isSelected={selectedPlayerIds.has(player.id)}
            onToggle={() => onTogglePlayer(player.id)}
            onUpdateRank={(rank) => onUpdateRank(player.id, rank)}
          />
        ))}
      </div>

      <PlayerListFooter
        totalPlayers={allPlayers.length}
        selectedCount={selectedPlayerIds.size}
      />
    </Container>
  );
}
