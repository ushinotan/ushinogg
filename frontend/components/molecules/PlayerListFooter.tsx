import {JSX} from "react";

interface PlayerListFooterProps {
  totalPlayers: number;
  selectedCount: number;
}

export function PlayerListFooter({ totalPlayers, selectedCount }: PlayerListFooterProps): JSX.Element {
  return (
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex justify-between text-sm text-slate-400">
          <span>合計: {totalPlayers}人</span>
          <span>選択済み: {selectedCount}人</span>
        </div>
      </div>
  );
}
