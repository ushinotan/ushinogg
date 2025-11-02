import { Rank, Division, RankMMR } from '@/types/game';

/**
 * ランクごとのベースMMR値
 * LOLのランクシステムに基づいたMMR値を定義
 */
const RANK_BASE_MMR: Record<Rank, number> = {
  Iron: 0,
  Bronze: 400,
  Silver: 800,
  Gold: 1200,
  Platinum: 1600,
  Diamond: 2000,
  Master: 2400,
  Grandmaster: 2700,
  Challenger: 3000,
};

/**
 * ディビジョンごとのMMRオフセット値
 * IV → III → II → I の順にMMRが上昇
 * ランク間400差を4等分（100ずつ）
 */
const DIVISION_OFFSET: Record<Division, number> = {
  IV: 0,
  III: 100,
  II: 200,
  I: 300,
};

/**
 * ランクとディビジョンからMMRを計算
 * @param rank プレイヤーのランク
 * @param division プレイヤーのディビジョン（Master以上は不要）
 * @returns 計算されたMMR値
 */
export function calculateMMR(rank: Rank, division?: Division): number {
  const baseMmr = RANK_BASE_MMR[rank];
  
  // Master以上はディビジョンなし
  if (rank === 'Master' || rank === 'Grandmaster' || rank === 'Challenger') {
    return baseMmr;
  }
  
  // ディビジョンが指定されていない場合はベースMMRを返す
  if (!division) {
    return baseMmr;
  }
  
  return baseMmr + DIVISION_OFFSET[division];
}

/**
 * すべてのランクとディビジョンの組み合わせのMMRリストを取得
 * @returns RankMMRの配列（MMRが低い順）
 */
export function getAllRankMMRList(): RankMMR[] {
  const rankList: RankMMR[] = [];
  
  // ディビジョンがあるランク
  const ranksWithDivision: Rank[] = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
  const divisions: Division[] = ['IV', 'III', 'II', 'I'];
  
  // ディビジョン付きランクを追加
  ranksWithDivision.forEach(rank => {
    divisions.forEach(division => {
      rankList.push({
        rank,
        division,
        baseMmr: calculateMMR(rank, division),
      });
    });
  });
  
  // Master以上を追加
  const masterTiers: Rank[] = ['Master', 'Grandmaster', 'Challenger'];
  masterTiers.forEach(rank => {
    rankList.push({
      rank,
      baseMmr: calculateMMR(rank),
    });
  });
  
  return rankList;
}

/**
 * 特定のランクのMMR範囲を取得
 * @param rank ランク
 * @returns { min: 最小MMR, max: 最大MMR }
 */
export function getRankMMRRange(rank: Rank): { min: number; max: number } {
  const allRanks: Rank[] = [
    'Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond',
    'Master', 'Grandmaster', 'Challenger'
  ];
  
  const currentIndex = allRanks.indexOf(rank);
  const min = RANK_BASE_MMR[rank];
  
  // 最上位ランク以外は次のランクのベースMMRが最大値
  if (currentIndex < allRanks.length - 1) {
    const max = RANK_BASE_MMR[allRanks[currentIndex + 1]];
    return { min, max };
  }
  
  // Challengerの場合は上限なし
  return { min, max: Infinity };
}

/**
 * MMR値からランクとディビジョンを推定
 * @param mmr MMR値
 * @returns RankMMR
 */
export function getRankFromMMR(mmr: number): RankMMR {
  const allRanks = getAllRankMMRList();
  
  // MMR値に最も近いランクを見つける（降順で探索）
  for (let i = allRanks.length - 1; i >= 0; i--) {
    if (mmr >= allRanks[i].baseMmr) {
      return allRanks[i];
    }
  }
  
  // 最低ランクを返す
  return allRanks[0];
}

