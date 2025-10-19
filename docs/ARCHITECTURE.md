# アーキテクチャ設計書

## システム概要

LOLカスタムゲームチーム分けツールは、League of Legendsのカスタムゲーム用に、プレイヤーのスキルレベル（MMR）に基づいてバランスの取れたチーム編成を行うWebアプリケーションです。

## アーキテクチャ図

```
┌─────────────────────────────────────────────────────────┐
│                     クライアント                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Next.js (React)                         │  │
│  │  - ページルーティング (App Router)                 │  │
│  │  - Chakra UI コンポーネント                       │  │
│  │  - NextAuth.js (Discord OAuth2)                   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │ HTTP/REST
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  バックエンドサーバー                    │
│  ┌───────────────────────────────────────────────────┐  │
│  │       Spring Boot (Kotlin)                        │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  Controller Layer (REST API)                │  │  │
│  │  │  - GameController                           │  │  │
│  │  │  - PlayerController                         │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  Service Layer                              │  │  │
│  │  │  - GameService                              │  │  │
│  │  │  - TeamBalancingService (MMRロジック)       │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  Repository Layer (Komapper)                │  │  │
│  │  │  - GameRepository                           │  │  │
│  │  │  - PlayerRepository                         │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │       Discord Bot (JDA)                           │  │
│  │  - Slash Commands (/customgame, /mmr, /history)  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │ JDBC
                          ▼
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL Database                         │
│  - players (プレイヤー情報、MMR)                         │
│  - games (ゲーム情報)                                   │
│  - game_players (ゲーム参加者)                          │
└─────────────────────────────────────────────────────────┘
```

## 技術スタック詳細

### フロントエンド

#### Next.js 15
- **App Router**: ファイルベースルーティング
- **Server Components**: サーバーサイドレンダリング
- **API Routes**: バックエンドAPIプロキシ

#### Chakra UI
- コンポーネントライブラリ
- レスポンシブデザイン
- テーマカスタマイズ

#### NextAuth.js
- Discord OAuth2認証
- セッション管理
- JWTトークン

### バックエンド

#### Kotlin
- 型安全性
- Null安全
- データクラス

#### Spring Boot 3
- Dependency Injection
- REST API
- Security (OAuth2 Client)

#### Komapper
- Kotlin用ORM
- 型安全なクエリ
- マッピング

#### JDA (Java Discord API)
- Discord Bot API
- Slash Commands
- イベントリスナー

### データベース

#### PostgreSQL 16
- リレーショナルデータベース
- ACID準拠
- インデックス最適化

## データモデル

### ER図

```
┌──────────────────┐
│     players      │
├──────────────────┤
│ id (PK)          │
│ discord_id       │◄─────┐
│ discord_username │      │
│ current_rank     │      │
│ mmr              │      │ 1
│ created_at       │      │
│ updated_at       │      │
└──────────────────┘      │
                          │
                          │
┌──────────────────┐      │ N
│      games       │      │
├──────────────────┤      │
│ id (PK)          │◄─────┼────┐
│ server_id        │      │    │
│ status           │      │    │ 1
│ winning_team     │      │    │
│ created_at       │      │    │
│ completed_at     │      │    │
└──────────────────┘      │    │
                          │    │
                          │    │ N
┌──────────────────┐      │    │
│  game_players    │      │    │
├──────────────────┤      │    │
│ id (PK)          │      │    │
│ game_id (FK)     ├──────┘    │
│ player_id (FK)   ├───────────┘
│ team             │
│ mmr_at_game      │
└──────────────────┘
```

### テーブル定義

#### players
- プレイヤーの基本情報とMMRを保存
- discord_idでユニーク制約

#### games
- カスタムゲームの情報を保存
- statusで試合の状態を管理（PENDING/IN_PROGRESS/COMPLETED）

#### game_players
- ゲームとプレイヤーの多対多関係
- 試合時点でのMMRを記録（履歴として）

## コアロジック

### チーム分けアルゴリズム

```kotlin
fun balanceTeams(players: List<Player>): TeamAssignment {
    var bestAssignment: TeamAssignment? = null
    var bestDifference = Int.MAX_VALUE
    
    // 1000回シャッフルして最適な組み合わせを探索
    repeat(1000) {
        val shuffled = players.shuffled()
        val blueTeam = shuffled.take(5)
        val redTeam = shuffled.drop(5)
        
        // 両チームの合計MMRを計算
        val blueMMR = blueTeam.sumOf { it.mmr }
        val redMMR = redTeam.sumOf { it.mmr }
        val difference = abs(blueMMR - redMMR)
        
        // より良いバランスなら更新
        if (difference < bestDifference) {
            bestDifference = difference
            bestAssignment = TeamAssignment(blueTeam, redTeam, difference)
        }
    }
    
    return bestAssignment!!
}
```

### MMR更新アルゴリズム (Eloレーティング)

```kotlin
fun updateMMR(winners: List<Player>, losers: List<Player>): Map<Long, Int> {
    val winnerAvgMMR = winners.map { it.mmr }.average()
    val loserAvgMMR = losers.map { it.mmr }.average()
    
    // 期待勝率を計算
    val expectedWinRate = 1.0 / (1.0 + 10.0.pow((loserAvgMMR - winnerAvgMMR) / 400.0))
    
    val K = 32  // K-factor
    
    // 勝者のMMR増加
    winners.forEach { player ->
        val change = (K * (1 - expectedWinRate)).toInt()
        newMMR[player.id] = player.mmr + change
    }
    
    // 敗者のMMR減少
    losers.forEach { player ->
        val change = (K * expectedWinRate).toInt()
        newMMR[player.id] = max(0, player.mmr - change)
    }
    
    return newMMR
}
```

## API設計

### RESTful API

- **GET /api/games/server/{serverId}** - 試合履歴取得
- **GET /api/games/{gameId}** - 試合詳細取得
- **POST /api/games** - ゲーム作成
- **POST /api/games/{gameId}/result** - 結果記録

### Discord Bot Commands

- **/customgame** - 新しいゲームを作成（フロントエンドリンク生成）
- **/history** - サーバーの試合履歴を表示
- **/mmr** - 自分のMMRを確認

## セキュリティ

### 認証・認可

1. **Discord OAuth2**
   - フロントエンド: NextAuth.js
   - バックエンド: Spring Security OAuth2 Client

2. **セッション管理**
   - JWT トークン
   - HTTPOnly Cookie

3. **CORS**
   - 許可されたオリジンのみアクセス可能

### データ保護

1. **機密情報の環境変数化**
   - Discord Client Secret
   - Bot Token
   - Database Password

2. **SQL Injection対策**
   - Komapperのパラメータバインディング使用

## スケーラビリティ

### 水平スケーリング

- フロントエンド: Vercel/Netlifyでのホスティング（自動スケール）
- バックエンド: Kubernetes/Docker Swarmでのコンテナオーケストレーション
- データベース: PostgreSQL Read Replica

### キャッシュ戦略

- Redis導入検討
- プレイヤー情報のキャッシュ
- 試合履歴のキャッシュ

## 監視・ロギング

### ログ

- Spring Boot Actuator
- 構造化ログ（JSON形式）
- ログレベル: DEBUG, INFO, WARN, ERROR

### メトリクス

- アプリケーションメトリクス（リクエスト数、レスポンス時間）
- JVMメトリクス（メモリ使用量、GC）
- データベースメトリクス（クエリ実行時間）

## デプロイメント

### 開発環境

- ローカルDocker Compose
- Hot Reload有効

### 本番環境

- フロントエンド: Vercel
- バックエンド: AWS ECS / GCP Cloud Run
- データベース: AWS RDS / GCP Cloud SQL
- Bot: 常時起動サーバー

## 今後の拡張

1. **リアルタイム通信**
   - WebSocketでのライブ更新
   - 試合状況のリアルタイム同期

2. **統計機能**
   - プレイヤー別の勝率
   - チャンピオン統計
   - グラフ可視化

3. **国際化 (i18n)**
   - 日本語/英語切り替え
   - Next.jsのi18n機能活用

4. **モバイルアプリ**
   - React Native
   - APIの再利用

## 参考資料

- [Next.js Documentation](https://nextjs.org/docs)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Komapper Documentation](https://www.komapper.org/)
- [JDA Documentation](https://github.com/discord-jda/JDA)
- [Elo Rating System](https://en.wikipedia.org/wiki/Elo_rating_system)
