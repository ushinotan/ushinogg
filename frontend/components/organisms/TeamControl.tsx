import { TeamDisplay } from './TeamDisplay';
import { Container, Button } from '../atom';
import type { Teams, TeamColor } from '@/types/game';
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
      <Container>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-300">選択中</h3>
          <span className="text-xl font-bold text-blue-400">{selectedCount}人</span>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={onShuffleTeams}
            disabled={selectedCount < 2}
            variant="primary"
            size="lg"
            icon={<Shuffle className="size-5" />}
            className="flex-1 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            {teams ? 'チーム再生成' : 'チーム分け'}
          </Button>
          {teams && (
            <Button
              onClick={onResetTeams}
              variant="secondary"
              size="lg"
              className="border border-slate-600"
            >
              リセット
            </Button>
          )}
        </div>
      </Container>

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

