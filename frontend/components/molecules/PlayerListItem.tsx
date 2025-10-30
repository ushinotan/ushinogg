import {
  Checkbox,
  createListCollection,
  Portal,
  Select,
} from "@chakra-ui/react";
import {Player, RankMMR} from "game";
import {generateInitialMMRs} from "@/lib/Mmr";
import {useMemo} from "react";
import {ValueChangeDetails} from "@zag-js/select";


interface PlayerListItemProps {
  player: Player;
  isSelected: boolean;
  onToggle: (checked: boolean) => void;
  onUpdateRank: (rank: ValueChangeDetails<RankMMR>) => void;
}


export function PlayerListItem({
                                 player,
                                 isSelected,
                                 onToggle,
                                 onUpdateRank,
                               }: PlayerListItemProps) {
  const ranks = useMemo(
    () => createListCollection({
      items: generateInitialMMRs(),
    }),
    []
  )
  return (
    <div
      onClick={() => onToggle(!isSelected)}
      className={`
          flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
          ${
        isSelected
          ? 'bg-blue-950/30 border-blue-600/50 hover:bg-blue-950/40'
          : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
      }
      `}
    >
      <Checkbox.Root
        checked={isSelected}
        onCheckedChange={(e) => {
          onToggle(!!e.checked)
        }}
        onClick={(e) => e.stopPropagation()}
        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600">
        <Checkbox.HiddenInput/>
        <Checkbox.Control/>
        <Checkbox.Label className={`flex-1 cursor-pointer min-w-0 ${
          isSelected ? 'text-blue-100' : 'text-slate-300'
        }`}>
          {player.name}
        </Checkbox.Label>
      </Checkbox.Root>
      <Select.Root collection={ranks} size="sm" onValueChange={(e) => onUpdateRank(e)}>
        <Select.HiddenSelect/>
        <Select.Control>
          <Select.Trigger onClick={(e) => e.stopPropagation()}>
            <Select.ValueText placeholder="Select framework"/>
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator/>
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {ranks.items.map((rank) => (
                <Select.Item item={rank} key={`${rank.rank}-${rank.division}`}>
                  {rank.rank} {rank.division} ({rank.baseMmr} MMR)
                  <Select.ItemIndicator/>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </div>
  );
}
