# クイックスタートガイド

LOLカスタムゲームチーム分けツールを5分で動かす方法。

## 前提条件

- Node.js 18以上
- Docker & Docker Compose
- Discord Developer Applicationの作成（[Discord Developer Portal](https://discord.com/developers/applications)）

## 1. リポジトリのクローン

```bash
git clone https://github.com/ushinotan/ushinogg.git
cd ushinogg
```

## 2. データベースの起動

```bash
docker-compose up -d
```

## 3. フロントエンドのセットアップ

```bash
cd frontend
npm install

# 環境変数設定
cp .env.example .env.local
```

`.env.local`を編集:
```env
DISCORD_CLIENT_ID=あなたのDiscord Client ID
DISCORD_CLIENT_SECRET=あなたのDiscord Client Secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXT_PUBLIC_API_URL=http://localhost:8080
```

```bash
# 開発サーバー起動
npm run dev
```

ブラウザで http://localhost:3000 を開く

## 4. バックエンドのセットアップ（オプション）

```bash
cd ../backend

# 環境変数設定
export DISCORD_CLIENT_ID=あなたのClient ID
export DISCORD_CLIENT_SECRET=あなたのClient Secret
export DISCORD_BOT_TOKEN=あなたのBot Token

# 起動
./gradlew bootRun
```

APIサーバーは http://localhost:8080 で起動

## 5. Discord Botの招待（オプション）

1. Discord Developer Portalで「OAuth2」→「URL Generator」を選択
2. SCOPESで`bot`と`applications.commands`を選択
3. BOT PERMISSIONSで「Send Messages」と「Use Slash Commands」を選択
4. 生成されたURLをコピーしてブラウザで開き、サーバーに招待

## 完了！

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:8080
- Discord Bot: サーバーで`/customgame`コマンドを実行

## トラブルシューティング

### データベースに接続できない
```bash
docker-compose down
docker-compose up -d
docker-compose logs postgres
```

### フロントエンドのビルドエラー
```bash
cd frontend
rm -rf node_modules .next
npm install
npm run dev
```

### バックエンドの起動エラー
```bash
cd backend
./gradlew clean build
./gradlew bootRun
```

## 詳細情報

詳しいセットアップ手順は[SETUP.md](docs/SETUP.md)を参照してください。
