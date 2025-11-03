import {Player, RankMMR} from "@/types/game";
import {getAllRankMMRList} from "@/lib/MMR";
import {useMemo} from "react";
import {Checkbox, Label, Select, PlayerRow} from "@/components/atom";


interface PlayerListItemProps {
  player: Player;
  isSelected: boolean;
  onToggle: (checked: boolean) => void;
  onUpdateRank: (rank: RankMMR) => void;
}


export function PlayerListItem({
  player,
  isSelected,
  onToggle,
  onUpdateRank,
}: PlayerListItemProps) {
  const ranks = useMemo(() => getAllRankMMRList(), []);

  return (
    <PlayerRow isSelected={isSelected} onClick={() => onToggle(!isSelected)}>
      <Checkbox
        checked={isSelected}
        onChange={onToggle}
        onClick={(e) => e.stopPropagation()}
      />
      <Label isActive={isSelected}>
        {player.name}
      </Label>
      <Select
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          const selectedRank = ranks.find(r => `${r.rank}-${r.division}` === e.target.value);
          if (selectedRank) onUpdateRank(selectedRank);
        }}
      >
        <option value="">ランクを選択</option>
        {ranks.map((rank) => (
          <option key={`${rank.rank}-${rank.division}`} value={`${rank.rank}-${rank.division}`}>
            {rank.rank} {rank.division} ({rank.baseMmr} MMR)
          </option>
        ))}
      </Select>
    </PlayerRow>
  );
}
