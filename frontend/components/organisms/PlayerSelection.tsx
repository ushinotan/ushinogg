import { Card } from '@chakra-ui/react';
import { PlayerListHeader } from '../molecules/PlayerListHeader';
import { PlayerListItem } from '../molecules/PlayerListItem';
import { PlayerListFooter } from '../molecules/PlayerListFooter';
import type { Player, RankMMR } from '@/types/game';
import { ValueChangeDetails } from "@zag-js/select";

interface PlayerSelectionProps {
  allPlayers: Player[];
  selectedPlayerIds: Set<string>;
  onTogglePlayer: (playerId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onUpdateRank: (playerId: string, rank: ValueChangeDetails<RankMMR>) => void;
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
    <Card.Root className="p-4 bg-slate-800/50 border-slate-700">
      <Card.Header>
        <PlayerListHeader onSelectAll={onSelectAll} onDeselectAll={onDeselectAll} />
      </Card.Header>

      <Card.Body>
        <div className="space-y-2">
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
      </Card.Body>

      <Card.Footer>
        <PlayerListFooter
          totalPlayers={allPlayers.length}
          selectedCount={selectedPlayerIds.size}
        />
      </Card.Footer>
    </Card.Root>
  );
}
