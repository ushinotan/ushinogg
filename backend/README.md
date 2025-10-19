# Backend - LOLカスタムゲームチーム分けツール

Kotlin + Spring Boot + Komapperで構築されたバックエンドAPI。

## セットアップ

```bash
./gradlew bootRun
```

APIサーバーは http://localhost:8080 で起動

詳細なドキュメントは[メインREADME](../README.md)を参照してください。

## 主な機能

- Discord OAuth2認証サーブレット
- カスタムゲーム管理REST API
- MMRベースチーム分けアルゴリズム
- Discord Bot (JDA)

## 環境変数

```bash
export DISCORD_CLIENT_ID=your_client_id
export DISCORD_CLIENT_SECRET=your_client_secret
export DISCORD_BOT_TOKEN=your_bot_token
```
