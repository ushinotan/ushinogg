# 変更履歴

このプロジェクトのすべての重要な変更はこのファイルに記録されます。

このフォーマットは[Keep a Changelog](https://keepachangelog.com/ja/1.0.0/)に基づいており、
このプロジェクトは[セマンティックバージョニング](https://semver.org/lang/ja/)に準拠しています。

## [Unreleased]

## [0.1.0] - 2025-10-19

### 追加

#### フロントエンド
- Next.js 15 + TypeScript + Chakra UIプロジェクトの初期化
- Discord OAuth2認証機能 (NextAuth.js)
- トップページ (`/`) - アプリケーション紹介
- ログインページ (`/auth/signin`) - Discord認証
- 試合履歴ページ (`/games`) - 試合一覧表示
- 試合詳細ページ (`/game/[id]`) - チーム分けと詳細情報
- デザインMOCKページ (`/mock`) - UIコンポーネント確認
- Chakra UI Provider統合
- レスポンシブデザイン対応
- 全メッセージの日本語化

#### バックエンド
- Kotlin + Spring Boot 3 + Komapperプロジェクトの初期化
- ゲーム作成API (`POST /api/games`)
- 試合結果記録API (`POST /api/games/{id}/result`)
- 試合履歴取得API (`GET /api/games/server/{serverId}`)
- 試合詳細取得API (`GET /api/games/{id}`)
- MMRベースのチーム分けアルゴリズム実装
- EloレーティングシステムによるMMR更新ロジック
- Discord Bot統合 (JDA)
- Discord Botスラッシュコマンド:
  - `/customgame` - ゲーム作成
  - `/history` - 試合履歴表示
  - `/mmr` - MMR確認
- Discord OAuth2認証サーブレット設定
- Spring Security設定

#### データベース
- PostgreSQL 16スキーマ定義
- `players`テーブル作成
- `games`テーブル作成
- `game_players`テーブル作成
- サンプルデータ投入SQL
- Docker Compose設定

#### ドキュメント
- README.md - プロジェクト概要と使い方
- QUICKSTART.md - 5分で動かすガイド
- docs/SETUP.md - 詳細なセットアップガイド
- docs/API.md - REST API仕様書
- docs/ARCHITECTURE.md - アーキテクチャ設計書
- docs/SUMMARY.md - 実装サマリー
- CONTRIBUTING.md - コントリビューションガイド
- CHANGELOG.md - 変更履歴（このファイル）
- LICENSE - MITライセンス

#### 設定・その他
- `.gitignore` ファイル（ルート、フロントエンド、バックエンド）
- `.env.example` ファイル（フロントエンド、バックエンド）
- Gradleビルドスクリプト
- TypeScript設定
- ESLint設定
- Tailwind CSS設定

### セキュリティ
- CodeQLセキュリティスキャン実施（脆弱性0件）
- 環境変数による機密情報管理
- SQLインジェクション対策（Komapperのパラメータバインディング）
- CORS設定

### 開発環境
- Node.js 18以上対応
- Java 17以上対応
- Docker & Docker Compose対応
- ホットリロード設定

## リリースの種類

### Added (追加)
新機能の追加

### Changed (変更)
既存機能の変更

### Deprecated (非推奨)
まもなく削除される機能

### Removed (削除)
今回で削除された機能

### Fixed (修正)
バグ修正

### Security (セキュリティ)
脆弱性に関する変更

---

[Unreleased]: https://github.com/ushinotan/ushinogg/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/ushinotan/ushinogg/releases/tag/v0.1.0
