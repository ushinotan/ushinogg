'use client';
import { PlayerSelection } from "@/components/organisms/PlayerSelection";
import { TeamControl } from "@/components/organisms/TeamControl";
import { LoadingSpinner, ErrorDisplay, ErrorBanner, Modal } from "@/components/atom";
import { Player, TeamColor, Teams } from "@/types/game";
import { Users } from "lucide-react";
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";

const mockPlayers = [
  { id: '1', name: 'Faker', rank: 'Challenger' },
  { id: '2', name: 'Chovy', rank: 'Challenger' },
  { id: '3', name: 'ShowMaker', rank: 'Grandmaster' },
  { id: '4', name: 'Deft', rank: 'Master' },
  { id: '5', name: 'Keria', rank: 'Challenger' },
  { id: '6', name: 'Zeus', rank: 'Grandmaster' },
  { id: '7', name: 'Oner', rank: 'Master' },
  { id: '8', name: 'Gumayusi', rank: 'Diamond' },
  { id: '9', name: 'Ruler', rank: 'Challenger' },
  { id: '10', name: 'Canyon', rank: 'Grandmaster' },
  { id: '11', name: 'BeryL', rank: 'Platinum' },
  { id: '12', name: 'Delight', rank: 'Gold' },
];

// モックAPI - 実際のAPIから取得する想定
const fetchPlayers = async (serverId: string, channelId: string): Promise<Player[]> => {
  // API呼び出しを模擬
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  return mockPlayers;
};

const fetchShuffleTeams = async (playerIds: string[]): Promise<Teams> => {
  // API呼び出しを模擬
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  return {
    blue: mockPlayers.filter((p) => playerIds.includes(p.id)).slice(0, 5),
    red: mockPlayers.filter((p) => playerIds.includes(p.id)).slice(5),
  };
};

const fetchRecordResult = async (teams: Teams, winner: TeamColor, serverId: string, channelId: string): Promise<void> => {
  // API呼び出しを模擬
  await new Promise((resolve) => setTimeout(resolve, 800));
  return;
};

export default function NewGame() {
  const searchParams = useSearchParams();
  const serverId = searchParams.get('server') ?? '';
  const channelId = searchParams.get('channel') ?? '';


  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<string>>(new Set());
  const [teams, setTeams] = useState<Teams | null>(null);
  const [loading, setLoading] = useState(true);
  const [shuffling, setShuffling] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    // バリデーション: serverIdとchannelIdが必須
    if (!serverId || !channelId) {
      setError('サーバーIDまたはチャンネルIDが指定されていません');
      setLoading(false);
      return;
    }

    setError(null);
    fetchPlayers(serverId, channelId)
      .then((players) => {
        setAllPlayers(players);
        setLoading(false);
      })
      .catch((err) => {
        console.error('参加者の取得に失敗しました:', err);
        setError('参加者リストの取得に失敗しました。もう一度お試しください。');
        setLoading(false);
      });
  }, [serverId, channelId]);

  const togglePlayerSelection = (playerId: string) => {
    const newSelection = new Set(selectedPlayerIds);
    if (newSelection.has(playerId)) {
      newSelection.delete(playerId);
    } else {
      newSelection.add(playerId);
    }
    setSelectedPlayerIds(newSelection);
    // 選択を変更したらチーム分けをリセット
    setTeams(null);
  }

  const selectAll = () => {
    setSelectedPlayerIds(new Set(allPlayers.map((p) => p.id)));
    setTeams(null);
  }

  const deselectAll = () => {
    setSelectedPlayerIds(new Set());
    setTeams(null);
  };

  const shuffleTeams = async () => {
    setShuffling(true);
    setError(null);
    try {
      const newTeams = await fetchShuffleTeams(Array.from(selectedPlayerIds));
      setTeams(newTeams);
    } catch (err) {
      console.error('チーム分けに失敗しました:', err);
      setError('チーム分けに失敗しました。もう一度お試しください。');
    } finally {
      setShuffling(false);
    }
  }

  const resetTeams = () => {
    setTeams(null);
  }

  const recordResult = async (winner: TeamColor) => {
    if (!teams) return;
    
    setRecording(true);
    setError(null);
    try {
      await fetchRecordResult(teams, winner, serverId, channelId);
      setTeams(null);
    } catch (err) {
      console.error('結果の記録に失敗しました:', err);
      setError('結果の記録に失敗しました。もう一度お試しください。');
    } finally {
      setRecording(false);
    }
  }

  const selectedCount = selectedPlayerIds.size;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner message="参加者リストを読み込み中..." />
      </div>
    );
  }

  // エラー表示
  if (error && allPlayers.length === 0) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Users className="size-10 text-blue-400" />
            <h1 className="text-blue-100">LOL カスタムゲーム チーム分けツール</h1>
          </div>
          <p className="text-slate-400">参加者を選択してチームを自動生成</p>
        </div>

        {/* エラーメッセージバナー */}
        {error && <ErrorBanner message={error} className="mb-6" />}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <PlayerSelection
              allPlayers={allPlayers}
              selectedPlayerIds={selectedPlayerIds}
              onTogglePlayer={togglePlayerSelection}
              onSelectAll={selectAll}
              onDeselectAll={deselectAll}
              onUpdateRank={(_playerId, _rank) => {}}
            />
          </div>

          <div>
            <TeamControl
              selectedCount={selectedCount}
              teams={teams}
              onShuffleTeams={shuffleTeams}
              onResetTeams={resetTeams}
              onRecordResult={recordResult}
            />
          </div>
        </div>

        {/* ローディングオーバーレイ */}
        <Modal isOpen={shuffling || recording}>
          <LoadingSpinner 
            size="lg" 
            message={shuffling ? 'チームを生成中...' : '結果を記録中...'} 
            className="[&>p]:text-slate-200 [&>p]:text-lg"
          />
        </Modal>
      </div>
    </div>
  )
}