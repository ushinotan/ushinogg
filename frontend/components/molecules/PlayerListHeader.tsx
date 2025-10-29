import { CheckSquare, Square } from 'lucide-react';
import {Button} from "@chakra-ui/react";

interface PlayerListHeaderProps {
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function PlayerListHeader({ onSelectAll, onDeselectAll }: PlayerListHeaderProps) {
  return (
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-300">参加者リスト</h3>
        <div className="flex gap-2">
          <Button
              variant="ghost"
              size="sm"
              onClick={onSelectAll}
              className="text-slate-400 hover:text-blue-400 hover:bg-blue-950/30"
          >
            <CheckSquare className="size-4 mr-1" />
            全選択
          </Button>
          <Button
              variant="ghost"
              size="sm"
              onClick={onDeselectAll}
              className="text-slate-400 hover:text-slate-300 hover:bg-slate-700"
          >
            <Square className="size-4 mr-1" />
            解除
          </Button>
        </div>
      </div>
  );
}
