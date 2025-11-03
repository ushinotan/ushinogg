import { CheckSquare, Square } from 'lucide-react';
import {Button} from "@/components/atom";

interface PlayerListHeaderProps {
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function PlayerListHeader({ onSelectAll, onDeselectAll }: PlayerListHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-slate-300">参加者リスト</h3>
      <div className="flex gap-2">
        <Button
          onClick={onSelectAll}
          variant="ghost"
          size="sm"
          icon={<CheckSquare className="size-4" />}
        >
          全選択
        </Button>
        <Button
          onClick={onDeselectAll}
          variant="ghost"
          size="sm"
          icon={<Square className="size-4" />}
        >
          解除
        </Button>
      </div>
    </div>
  );
}
