import { TeamDisplay } from './TeamDisplay';
import type { Teams, TeamColor } from '@/types/game';
import { Button, Card } from '@chakra-ui/react';
import { Shuffle, Users } from 'lucide-react';

interface TeamControlProps {
  selectedCount: number;
  teams: Teams | null;
  onShuffleTeams: () => void;
  onResetTeams: () => void;
  onRecordResult: (winner: TeamColor) => void;
}

export function TeamControl({
  selectedCount,
  teams,
  onShuffleTeams,
  onResetTeams,
  onRecordResult,
}: TeamControlProps) {
  return (
    <div className="space-y-4">
      <Card.Root className="p-4 bg-slate-800/50 border-slate-700">
        <Card.Body>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-300">選択中</h3>
            <span className="text-blue-400">{selectedCount}人</span>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={onShuffleTeams}
              disabled={selectedCount < 2}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Shuffle className="size-4 mr-2" />
              {teams ? 'チーム再生成' : 'チーム分け'}
            </Button>
            {teams && (
              <Button
                onClick={onResetTeams}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                リセット
              </Button>
            )}
          </div>
        </Card.Body>
      </Card.Root>

      {teams && <TeamDisplay teams={teams} onRecordResult={onRecordResult} />}

      {!teams && selectedCount > 0 && (
        <div className="text-center text-slate-400 mt-12">
          <Users className="size-12 mx-auto mb-3 opacity-30" />
          <p>「チーム分け」ボタンを押してください</p>
        </div>
      )}

      {selectedCount === 0 && (
        <div className="text-center text-slate-400 mt-12">
          <Users className="size-12 mx-auto mb-3 opacity-30" />
          <p>参加者を選択してください</p>
        </div>
      )}
    </div>
  );
}

