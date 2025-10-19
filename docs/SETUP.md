# セットアップガイド

LOLカスタムゲームチーム分けツールのセットアップ手順を説明します。

## 1. 前提条件

以下のソフトウェアがインストールされている必要があります：

- **Node.js** 18以上 ([ダウンロード](https://nodejs.org/))
- **Java** 17以上 ([ダウンロード](https://adoptium.net/))
- **Docker & Docker Compose** ([ダウンロード](https://www.docker.com/products/docker-desktop))
- **Git** ([ダウンロード](https://git-scm.com/))

## 2. リポジトリのクローン

```bash
git clone https://github.com/ushinotan/ushinogg.git
cd ushinogg
```

## 3. Discord Applicationの設定

### 3.1 Discord Developer Portalでアプリケーション作成

1. [Discord Developer Portal](https://discord.com/developers/applications)にアクセス
2. 「New Application」をクリック
3. アプリケーション名を入力（例: "LOL Custom Game"）

### 3.2 OAuth2設定

1. 左メニューから「OAuth2」を選択
2. 「Redirects」に以下のURLを追加:
   ```
   http://localhost:3000/api/auth/callback/discord
   http://localhost:8080/login/oauth2/code/discord
   ```
3. Client IDとClient Secretをメモ

### 3.3 Bot作成

1. 左メニューから「Bot」を選択
2. 「Add Bot」をクリック
3. Bot Tokenをメモ（「Reset Token」で確認可能）
4. 「Privileged Gateway Intents」で以下を有効化:
   - Server Members Intent
   - Message Content Intent

### 3.4 Botの招待

1. 左メニューから「OAuth2」→「URL Generator」を選択
2. 「SCOPES」で以下を選択:
   - `bot`
   - `applications.commands`
3. 「BOT PERMISSIONS」で以下を選択:
   - Send Messages
   - Use Slash Commands
4. 生成されたURLをコピーしてブラウザで開く
5. Botを招待したいサーバーを選択

## 4. データベースセットアップ

### 4.1 PostgreSQLの起動

```bash
# プロジェクトルートで実行
docker-compose up -d

# 起動確認
docker ps
```

### 4.2 データベース接続確認

```bash
docker exec -it customgame-postgres psql -U postgres -d customgame

# psqlプロンプトで
\dt  # テーブル一覧表示
\q   # 終了
```

初期データ（テストプレイヤー10人とサンプルゲーム）が自動的に投入されます。

## 5. フロントエンドセットアップ

### 5.1 依存関係のインストール

```bash
cd frontend
npm install
```

### 5.2 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local`ファイルを編集:

```env
# Discord OAuth設定
DISCORD_CLIENT_ID=あなたのClient ID
DISCORD_CLIENT_SECRET=あなたのClient Secret

# NextAuth設定
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=ランダムな文字列（openssl rand -base64 32で生成可能）

# バックエンドAPI URL
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 5.3 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセス

## 6. バックエンドセットアップ

### 6.1 環境変数の設定

```bash
cd ../backend

# Linux/Mac
export DISCORD_CLIENT_ID=あなたのClient ID
export DISCORD_CLIENT_SECRET=あなたのClient Secret
export DISCORD_BOT_TOKEN=あなたのBot Token

# Windows (PowerShell)
$env:DISCORD_CLIENT_ID="あなたのClient ID"
$env:DISCORD_CLIENT_SECRET="あなたのClient Secret"
$env:DISCORD_BOT_TOKEN="あなたのBot Token"
```

または、`backend/src/main/resources/application-local.yml`を作成:

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          discord:
            client-id: あなたのClient ID
            client-secret: あなたのClient Secret

discord:
  bot:
    token: あなたのBot Token
```

### 6.2 アプリケーションの起動

```bash
./gradlew bootRun

# または、ビルドしてから実行
./gradlew build
java -jar build/libs/customgame-0.0.1-SNAPSHOT.jar
```

APIサーバーは http://localhost:8080 で起動

## 7. 動作確認

### 7.1 フロントエンド

1. http://localhost:3000 にアクセス
2. 「Discordでログイン」をクリック
3. Discord認証画面で許可
4. トップページにリダイレクト

### 7.2 Discord Bot

Discordサーバーで以下のコマンドを実行:

```
/customgame
```

Botが応答し、フロントエンドへのリンクが表示されることを確認

### 7.3 API

```bash
# ヘルスチェック
curl http://localhost:8080/actuator/health

# ゲーム作成テスト
curl -X POST http://localhost:8080/api/games \
  -H "Content-Type: application/json" \
  -d '{
    "serverId": "test_server",
    "playerIds": [1,2,3,4,5,6,7,8,9,10]
  }'
```

## 8. トラブルシューティング

### フロントエンドが起動しない

```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### バックエンドが起動しない

```bash
# Gradleキャッシュをクリア
./gradlew clean

# 依存関係を再取得
./gradlew build --refresh-dependencies
```

### データベースに接続できない

```bash
# Dockerコンテナを再起動
docker-compose down
docker-compose up -d

# ログを確認
docker-compose logs postgres
```

### Discord Botが応答しない

1. Bot Tokenが正しく設定されているか確認
2. Botがサーバーに招待されているか確認
3. Bot Permissionsが正しく設定されているか確認
4. バックエンドのログを確認:
   ```bash
   ./gradlew bootRun | grep Discord
   ```

## 9. 本番環境へのデプロイ

### 環境変数の設定

本番環境では以下の環境変数を設定:

```env
# フロントエンド
DISCORD_CLIENT_ID=本番用Client ID
DISCORD_CLIENT_SECRET=本番用Client Secret
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=強固なランダム文字列
NEXT_PUBLIC_API_URL=https://api.your-domain.com

# バックエンド
DISCORD_CLIENT_ID=本番用Client ID
DISCORD_CLIENT_SECRET=本番用Client Secret
DISCORD_BOT_TOKEN=本番用Bot Token
SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/customgame
SPRING_DATASOURCE_USERNAME=your-db-user
SPRING_DATASOURCE_PASSWORD=your-db-password
```

### セキュリティ設定

1. HTTPS/TLSを有効化
2. CORSを適切に設定
3. レート制限を実装
4. データベースへのアクセスを制限

## 10. 次のステップ

- [API仕様書](./API.md)を参照してAPIの詳細を確認
- [README.md](../README.md)でプロジェクト全体の概要を確認
- 実際にカスタムゲームを作成して動作を確認

## サポート

問題が発生した場合は、GitHubのIssuesで報告してください。
