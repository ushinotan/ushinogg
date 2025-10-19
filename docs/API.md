# API仕様書

## 概要

LOLカスタムゲームチーム分けツールのREST API仕様です。

## ベースURL

```
http://localhost:8080/api
```

## 認証

現在は認証なしでアクセス可能です。将来的にはDiscord OAuth2トークンを使用した認証を実装予定。

## エンドポイント

### プレイヤー管理

#### サモナー名登録

プレイヤーのサモナー名を登録し、Riot APIからランク情報を取得してMMRを自動計算します。

```http
POST /api/players/{playerId}/register-summoner
```

**パスパラメータ:**
- `playerId` - プレイヤーID

**リクエストボディ:**

```json
{
  "playerId": 1,
  "summonerName": "Hide on bush",
  "region": "kr"
}
```

**レスポンス:**

```json
{
  "id": 1,
  "discordId": "discord_123456789",
  "discordUsername": "Player1",
  "summonerName": "Hide on bush",
  "summonerRegion": "kr",
  "currentRank": "CHALLENGER I",
  "currentTier": "CHALLENGER",
  "currentDivision": "I",
  "currentLp": 1234,
  "mmr": 5468
}
```

**ステータスコード:**
- `200 OK` - 成功
- `400 Bad Request` - サモナーが見つからない
- `500 Internal Server Error` - サーバーエラー

---

#### ランク情報更新

登録済みのサモナーのランク情報を更新し、MMRを再計算します。

```http
POST /api/players/{playerId}/update-rank
```

**パスパラメータ:**
- `playerId` - プレイヤーID

**レスポンス:**

```json
{
  "id": 1,
  "discordId": "discord_123456789",
  "discordUsername": "Player1",
  "summonerName": "Hide on bush",
  "summonerRegion": "kr",
  "currentRank": "CHALLENGER I",
  "currentTier": "CHALLENGER",
  "currentDivision": "I",
  "currentLp": 1250,
  "mmr": 5500
}
```

**ステータスコード:**
- `200 OK` - 成功
- `400 Bad Request` - サモナー名が未登録
- `404 Not Found` - プレイヤーが見つからない

---

### ゲーム管理

#### ゲーム作成

新しいカスタムゲームを作成し、プレイヤーを自動的にバランスの取れた2チームに分けます。

```http
POST /api/games
```

**リクエストボディ:**

```json
{
  "serverId": "string",      // DiscordサーバーID
  "playerIds": [1, 2, ...]   // 参加プレイヤーIDのリスト (10人)
}
```

**レスポンス:**

```json
{
  "id": 1,
  "serverId": "server_001",
  "status": "PENDING",
  "winningTeam": null,
  "blueTeam": [
    {
      "player": {
        "id": 1,
        "discordId": "123456789",
        "discordUsername": "Player1",
        "currentRank": "Gold",
        "mmr": 1500
      },
      "team": "BLUE",
      "mmrAtGame": 1500
    }
    // ... 他の4人
  ],
  "redTeam": [
    // ... 5人
  ],
  "createdAt": "2025-10-19T10:00:00",
  "completedAt": null
}
```

**ステータスコード:**
- `200 OK` - 成功
- `400 Bad Request` - リクエストが不正
- `500 Internal Server Error` - サーバーエラー

---

#### 試合結果記録

試合の結果を記録し、プレイヤーのMMRを更新します。

```http
POST /api/games/{gameId}/result
```

**パスパラメータ:**
- `gameId` - ゲームID

**リクエストボディ:**

```json
{
  "gameId": 1,
  "winningTeam": "BLUE"  // "BLUE" または "RED"
}
```

**レスポンス:**

```json
{
  "id": 1,
  "serverId": "server_001",
  "status": "COMPLETED",
  "winningTeam": "BLUE",
  "blueTeam": [...],
  "redTeam": [...],
  "createdAt": "2025-10-19T10:00:00",
  "completedAt": "2025-10-19T10:35:00"
}
```

**ステータスコード:**
- `200 OK` - 成功
- `404 Not Found` - ゲームが見つからない
- `400 Bad Request` - 既に結果が記録されている

---

#### サーバーの試合履歴取得

特定のDiscordサーバーの試合履歴を取得します。

```http
GET /api/games/server/{serverId}
```

**パスパラメータ:**
- `serverId` - DiscordサーバーID

**レスポンス:**

```json
[
  {
    "id": 1,
    "serverId": "server_001",
    "status": "COMPLETED",
    "winningTeam": "BLUE",
    "blueTeamCount": 5,
    "redTeamCount": 5,
    "createdAt": "2025-10-19T10:00:00"
  },
  {
    "id": 2,
    "serverId": "server_001",
    "status": "COMPLETED",
    "winningTeam": "RED",
    "blueTeamCount": 5,
    "redTeamCount": 5,
    "createdAt": "2025-10-18T15:30:00"
  }
]
```

**ステータスコード:**
- `200 OK` - 成功
- `404 Not Found` - サーバーが見つからない

---

#### 試合詳細取得

特定の試合の詳細情報を取得します。

```http
GET /api/games/{gameId}
```

**パスパラメータ:**
- `gameId` - ゲームID

**レスポンス:**

```json
{
  "id": 1,
  "serverId": "server_001",
  "status": "COMPLETED",
  "winningTeam": "BLUE",
  "blueTeam": [
    {
      "player": {
        "id": 1,
        "discordId": "123456789",
        "discordUsername": "Player1",
        "currentRank": "Gold",
        "mmr": 1500
      },
      "team": "BLUE",
      "mmrAtGame": 1500
    }
    // ... 他の4人
  ],
  "redTeam": [
    // ... 5人
  ],
  "createdAt": "2025-10-19T10:00:00",
  "completedAt": "2025-10-19T10:35:00"
}
```

**ステータスコード:**
- `200 OK` - 成功
- `404 Not Found` - ゲームが見つからない

---

## データモデル

### Player (プレイヤー)

```typescript
interface Player {
  id: number;
  discordId: string;
  discordUsername: string;
  currentRank: string | null;  // Iron, Bronze, Silver, Gold, Platinum, Diamond, etc.
  mmr: number;                  // 内部レーティング (初期値: 1500)
}
```

### Game (ゲーム)

```typescript
interface Game {
  id: number;
  serverId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  winningTeam: 'BLUE' | 'RED' | null;
  createdAt: string;            // ISO 8601形式
  completedAt: string | null;   // ISO 8601形式
}
```

### GamePlayer (ゲーム参加者)

```typescript
interface GamePlayer {
  player: Player;
  team: 'BLUE' | 'RED';
  mmrAtGame: number;  // 試合時点でのMMR
}
```

## エラーレスポンス

エラー時は以下の形式でレスポンスを返します：

```json
{
  "timestamp": "2025-10-19T10:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "プレイヤー数は10人である必要があります",
  "path": "/api/games"
}
```

## レート制限

現在はレート制限を設けていません。将来的には実装予定です。

## 変更履歴

- **v0.0.1** (2025-10-19) - 初版作成
