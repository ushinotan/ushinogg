# LOLカスタムゲーム チーム分けツール

League of Legendsのカスタムゲーム用の自動チーム分けツールです。MMR（内部レーティング）に基づいてバランスの取れたチーム編成を行います。

## 主な機能

- 🎮 **Discord認証**: Discordアカウントでログイン
- 👤 **サモナー登録**: Riot APIと連携してサモナー名を登録
- 📊 **試合履歴管理**: カスタムゲームの勝敗と参加者を記録・閲覧
- ⚖️ **自動チーム分け**: MMRとランクを考慮した公平なチーム編成
- 🤖 **Discord Bot統合**: Botコマンドから試合を作成
- 📈 **MMRシステム**: ソロランクから自動計算、試合結果に基づいて管理

## 技術スタック

### フロントエンド
- **Next.js 15** - Reactフレームワーク
- **TypeScript** - 型安全性
- **Chakra UI** - UIコンポーネントライブラリ
- **NextAuth.js** - Discord OAuth2認証

### バックエンド
- **Kotlin** - プログラミング言語
- **Spring Boot 3** - アプリケーションフレームワーク
- **Komapper** - ORMライブラリ
- **JDA** - Discord Bot API

### データベース
- **PostgreSQL 16** - リレーショナルデータベース

## セットアップ

### 前提条件

- Node.js 18以上
- Java 17以上
- Docker & Docker Compose（データベース用）
- Discord Application（Bot & OAuth2）

### Discord Application設定

1. [Discord Developer Portal](https://discord.com/developers/applications)でアプリケーションを作成
2. OAuth2のRedirect URLsに以下を追加:
   - `http://localhost:3000/api/auth/callback/discord`
   - `http://localhost:8080/login/oauth2/code/discord`
3. BotタブでBotを作成してトークンを取得
4. Bot PermissionsでSlash Commandsを有効化

### Riot API設定

1. [Riot Developer Portal](https://developer.riotgames.com/)でアカウント作成
2. Development API Keyを取得（24時間有効）
3. 本番環境ではProduction API Keyの申請が必要

### データベースセットアップ

```bash
# Docker ComposeでPostgreSQLを起動
docker-compose up -d

# データベース接続確認
docker exec -it customgame-postgres psql -U postgres -d customgame
```

### フロントエンドセットアップ

```bash
cd frontend

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env.local
# .env.localを編集してDiscord Client IDとSecretを設定

# 開発サーバー起動
npm run dev
```

ブラウザで http://localhost:3000 にアクセス

### バックエンドセットアップ

```bash
cd backend

# 環境変数設定
export DISCORD_CLIENT_ID=your_client_id
export DISCORD_CLIENT_SECRET=your_client_secret
export DISCORD_BOT_TOKEN=your_bot_token
export RIOT_API_KEY=your_riot_api_key

# ビルド＆実行
./gradlew bootRun
```

APIサーバーは http://localhost:8080 で起動

## 使い方

### Discord Botコマンド

サーバーにBotを招待後、以下のコマンドが使用可能:

- `/customgame` - 新しいカスタムゲームを作成（フロントエンドリンクを生成）
- `/history` - サーバーの試合履歴を表示
- `/mmr` - 自分のMMRを確認

### Web UI

1. **ログイン**: Discordアカウントでログイン
2. **サモナー登録**: サモナー名を登録してランクからMMRを自動計算
3. **試合作成**: Botコマンドまたは直接Web UIから試合を作成
4. **チーム編成**: 10人のプレイヤーが自動的にバランスの取れた2チームに分けられる
5. **結果記録**: 試合終了後、勝利チームを記録してMMRを更新

## プロジェクト構造

```
ushinogg/
├── frontend/               # Next.jsフロントエンド
│   ├── app/               # App Router
│   │   ├── page.tsx       # トップページ
│   │   ├── auth/          # 認証ページ
│   │   ├── games/         # 試合履歴
│   │   ├── game/[id]/     # 試合詳細
│   │   └── mock/          # デザインMOCK
│   └── types/             # TypeScript型定義
│
├── backend/               # Kotlin Spring Bootバックエンド
│   └── src/
│       └── main/
│           ├── kotlin/
│           │   └── com/ushinogg/customgame/
│           │       ├── model/        # ドメインモデル
│           │       ├── dto/          # データ転送オブジェクト
│           │       ├── service/      # ビジネスロジック
│           │       ├── controller/   # REST API
│           │       ├── bot/          # Discord Bot
│           │       └── config/       # 設定
│           └── resources/
│               └── application.yml
│
├── database/              # データベース関連
│   └── migrations/        # SQLマイグレーション
│
└── docs/                  # ドキュメント
```

## API仕様

### ゲーム作成
```
POST /api/games
Content-Type: application/json

{
  "serverId": "discord_server_id",
  "playerIds": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}
```

### 試合結果記録
```
POST /api/games/{gameId}/result
Content-Type: application/json

{
  "gameId": 1,
  "winningTeam": "BLUE"
}
```

### 試合履歴取得
```
GET /api/games/server/{serverId}
```

### 試合詳細取得
```
GET /api/games/{gameId}
```

## MMRシステム

- 初期MMR: 1500
- Eloレーティングシステムを使用
- 勝利チームのMMRが上昇、敗北チームのMMRが減少
- チーム全体の平均MMRに基づいて変動幅を調整
- MMRは0以下にならない

## 開発

### フロントエンド開発

```bash
cd frontend
npm run dev      # 開発サーバー
npm run build    # プロダクションビルド
npm run lint     # ESLint実行
```

### バックエンド開発

```bash
cd backend
./gradlew bootRun           # 開発サーバー
./gradlew build             # ビルド
./gradlew test              # テスト実行
```

## ライセンス

MIT License

## 作者

ushinotan