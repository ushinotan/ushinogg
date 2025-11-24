'use client';
import { PlayerSelection } from "@/components/organisms/PlayerSelection";
import { TeamControl } from "@/components/organisms/TeamControl";
import { LoadingSpinner, ErrorDisplay, ErrorBanner, Modal } from "@/components/atom";
import { Player, TeamColor, Teams } from "@/types/game";
import { Users } from "lucide-react";
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/const";

// API型定義（バックエンドのDTOに対応）
interface PlayerDtoFromApi {
  id: number;
  discordId: string;
  discordUsername: string;
  currentRank: string | null;
  mmr: number | null;
}

interface ShufflePlayerDto {
  discordId: string;
  discordUsername: string;
  mmr: number;
}

interface ShuffleResponseDto {
  team1: ShufflePlayerDto[];
  team2: ShufflePlayerDto[];
  team1AvgMmr: number;
  team2AvgMmr: number;
  mmrDifference: number;
}

interface GameResultPlayerDto {
  discordId: string;
  mmr: number;
}

interface GameResultDto {
  serverId: string;
  winningTeam: GameResultPlayerDto[];
  losingTeam: GameResultPlayerDto[];
}

// APIから取得したPlayerDtoを内部のPlayer型に変換
const convertToPlayer = (dto: PlayerDtoFromApi): Player => ({
  id: dto.discordId,
  name: dto.discordUsername,
  rank: dto.currentRank ?? undefined,
  mmr: dto.mmr ?? undefined,
});

// 内部のPlayer型をAPI用のShufflePlayerDtoに変換
const convertToShufflePlayerDto = (player: Player): ShufflePlayerDto => ({
  discordId: player.id,
  discordUsername: player.name,
  mmr: player.mmr ?? 1000, // デフォルトMMR
});

// プレイヤー一覧取得API
const fetchPlayers = async (serverId: string, channelId: string): Promise<Player[]> => {
  const response = await fetch(`${API_BASE_URL}/api/games/members/${serverId}/${channelId}`);

  if (!response.ok) {
    throw new Error(`プレイヤー取得に失敗しました: ${response.status}`);
  }

  const data: PlayerDtoFromApi[] = await response.json();
  return data.map(convertToPlayer);
};

// チームシャッフルAPI
const fetchShuffleTeams = async (players: Player[]): Promise<Teams> => {
  const requestBody = {
    players: players.map(convertToShufflePlayerDto),
  };

  const response = await fetch(`${API_BASE_URL}/api/games/shuffle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`チームシャッフルに失敗しました: ${response.status}`);
  }

  const data: ShuffleResponseDto = await response.json();

  // ShufflePlayerDtoをPlayer型に変換
  const convertShufflePlayerToPlayer = (dto: ShufflePlayerDto): Player => ({
    id: dto.discordId,
    name: dto.discordUsername,
    mmr: dto.mmr,
  });

  return {
    blue: data.team1.map(convertShufflePlayerToPlayer),
    red: data.team2.map(convertShufflePlayerToPlayer),
  };
};

// ゲーム結果記録API
const fetchRecordResult = async (teams: Teams, winner: TeamColor, serverId: string): Promise<void> => {
  const winningTeam = winner === 'blue' ? teams.blue : teams.red;
  const losingTeam = winner === 'blue' ? teams.red : teams.blue;

  const requestBody: GameResultDto = {
    serverId,
    winningTeam: winningTeam.map(p => ({
      discordId: p.id,
      mmr: p.mmr ?? 1000,
    })),
    losingTeam: losingTeam.map(p => ({
      discordId: p.id,
      mmr: p.mmr ?? 1000,
    })),
  };

  const response = await fetch(`${API_BASE_URL}/api/games/result`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`結果記録に失敗しました: ${response.status}`);
  }
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
      const selectedPlayers = allPlayers.filter((p) => selectedPlayerIds.has(p.id));
      const newTeams = await fetchShuffleTeams(selectedPlayers);
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
      await fetchRecordResult(teams, winner, serverId);
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
