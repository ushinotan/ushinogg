# コントリビューションガイド

LOLカスタムゲームチーム分けツールへのコントリビューションをありがとうございます！

## 開発環境のセットアップ

[SETUP.md](docs/SETUP.md)を参照してローカル開発環境をセットアップしてください。

## コントリビューションの流れ

1. **Issue を確認・作成**
   - 既存のIssueを確認
   - 新しい機能や修正の場合は、まずIssueを作成して議論

2. **フォーク & ブランチ作成**
   ```bash
   git clone https://github.com/あなたのユーザー名/ushinogg.git
   cd ushinogg
   git checkout -b feature/your-feature-name
   ```

3. **開発**
   - コードを変更
   - 適切なコミットメッセージを記述
   - テストを追加/更新（該当する場合）

4. **テスト**
   ```bash
   # フロントエンド
   cd frontend
   npm run build
   npm run lint
   
   # バックエンド
   cd backend
   ./gradlew build
   ./gradlew test
   ```

5. **プルリクエスト作成**
   - mainブランチに対してPRを作成
   - 変更内容を明確に説明
   - 関連するIssue番号を記載

## コーディング規約

### フロントエンド (TypeScript/React)

- **ファイル命名**: PascalCase for components, camelCase for utilities
- **コンポーネント**: 関数コンポーネントを使用
- **型定義**: TypeScriptの型を適切に使用
- **スタイル**: Chakra UIのコンポーネントとユーティリティを使用

```typescript
// Good
interface PlayerProps {
  name: string
  mmr: number
}

export function PlayerCard({ name, mmr }: PlayerProps) {
  return <Box>{name} - MMR: {mmr}</Box>
}
```

### バックエンド (Kotlin)

- **命名規則**: Kotlinの標準規約に従う
- **クラス設計**: 単一責任の原則を守る
- **関数**: 純粋関数を優先
- **null安全**: Kotlinのnull安全機能を活用

```kotlin
// Good
data class Player(
    val id: Long,
    val name: String,
    val mmr: Int
)

fun calculateAverageMMR(players: List<Player>): Double {
    return players.map { it.mmr }.average()
}
```

## コミットメッセージ

コミットメッセージは以下の形式に従ってください：

```
<type>: <subject>

<body>
```

**Type:**
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント変更
- `style`: コードスタイル変更（機能に影響なし）
- `refactor`: リファクタリング
- `test`: テスト追加・変更
- `chore`: ビルドプロセスや補助ツールの変更

**例:**
```
feat: MMR更新アルゴリズムの改善

Eloレーティングシステムを実装し、より正確なMMR計算を行うようにしました。
期待勝率に基づいてMMR変動を調整します。
```

## プルリクエストのガイドライン

### チェックリスト

- [ ] コードが正しくビルドされる
- [ ] 既存のテストがパスする
- [ ] 新しい機能にテストを追加（該当する場合）
- [ ] ドキュメントを更新（該当する場合）
- [ ] コミットメッセージが規約に従っている
- [ ] 変更内容が適切に説明されている

### レビュー

- コードレビューでフィードバックがあった場合は、対応してください
- 質問や議論は歓迎します
- レビュワーの提案を理解できない場合は、遠慮なく質問してください

## バグ報告

バグを発見した場合は、以下の情報を含むIssueを作成してください：

1. **環境情報**
   - OS
   - Node.jsバージョン
   - Javaバージョン
   - ブラウザ（フロントエンドの場合）

2. **再現手順**
   - 具体的な操作手順
   - 期待される動作
   - 実際の動作

3. **スクリーンショット・ログ**
   - エラーメッセージ
   - スクリーンショット（該当する場合）

## 機能リクエスト

新機能の提案は歓迎します。以下を含むIssueを作成してください：

1. **背景・動機**
   - なぜこの機能が必要か
   - どのような問題を解決するか

2. **提案する解決策**
   - 具体的な実装案
   - UIのモックアップ（該当する場合）

3. **代替案**
   - 他に考えられる方法

## 質問

質問がある場合は、遠慮なくIssueを作成するか、Discussionsで投稿してください。

## ライセンス

このプロジェクトにコントリビューションすることで、あなたの貢献がMITライセンスの下でライセンスされることに同意したものとみなされます。

## 行動規範

すべてのコントリビューターは、相互に尊重し、建設的なコミュニケーションを心がけてください。

ありがとうございます！ 🎮
