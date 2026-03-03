# 仕様書駆動開発（Spec Driven）学習サイト

React + TypeScript で作った STEP 形式の学習サイトです。  
テーマは「仕様書駆動開発」。将来的に技術カテゴリ別の総合学習サイトへ拡張できる構成にしています。

## 機能

- **STEP 形式**: 左に STEP 一覧、右に教材
- **選択式問題**: 各 STEP に複数の 4 択問題
- **正誤表示**: 回答後に正解/不正解と解説を表示
- **スコア表示**: 全体の正解数・回答数・正答率を表示

## 開発

```bash
npm install
npm run dev
```

ビルド:

```bash
npm run build
```

## GitHub Pages で公開する

1. このフォルダを **リポジトリ名 `spec-driven-learning`** で GitHub にプッシュする。
2. `npm install` のあと、`npm run deploy` を実行。
3. リポジトリの **Settings → Pages** で、Source を **Deploy from a branch**、Branch を **gh-pages** / **(root)** に設定して Save。
4. 公開 URL: `https://<あなたのユーザー名>.github.io/spec-driven-learning/`

## ディレクトリ構成

```
spec-driven-learning/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx              # エントリ
│   ├── App.tsx               # ルート（LearningProvider + LearningPage）
│   ├── index.css             # グローバルスタイル・CSS変数
│   │
│   ├── types/
│   │   └── index.ts          # 共通型（Category, Step, QuizQuestion, AnswerRecord, ScoreSummary）
│   │
│   ├── data/
│   │   └── categories/
│   │       ├── index.ts      # カテゴリ一覧・getCategoryById / getDefaultCategory
│   │       └── spec-driven/
│   │           ├── index.ts  # 仕様書駆動カテゴリのメタ情報
│   │           └── steps.ts  # STEP 本文・問題データ
│   │
│   ├── context/
│   │   └── LearningContext.tsx  # 学習状態（カテゴリ・現在STEP・回答履歴）
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── LearningLayout.tsx      # 左サイドバー + 右メインの2カラム
│   │   │   └── LearningLayout.module.css
│   │   ├── StepList/
│   │   │   ├── StepList.tsx             # 左：STEP 一覧・現在STEP・正答数バッジ
│   │   │   └── StepList.module.css
│   │   ├── StepContent/
│   │   │   ├── StepContent.tsx         # 教材本文（見出し・リスト・区切り線）
│   │   │   └── StepContent.module.css
│   │   ├── QuizCard/
│   │   │   ├── QuizCard.tsx             # 1問分の選択式UI・正誤・解説
│   │   │   └── QuizCard.module.css
│   │   └── ScoreDisplay/
│   │       ├── ScoreDisplay.tsx         # スコア（正解数/総数・進捗バー・%）
│   │       └── ScoreDisplay.module.css
│   │
│   └── pages/
│       └── LearningPage.tsx  # カテゴリ設定・レイアウト・STEP内容・クイズ表示
```

### 設計のポイント

- **カテゴリ単位でデータを分離**  
  `data/categories/spec-driven/` のように「1カテゴリ = 1フォルダ」にし、`categories/index.ts` で一覧化。  
  「つくりながら学ぶReact」など新しいカテゴリは、同じ型（`Category`, `Step`）で `steps` を追加し、`categories` に push するだけで対応可能。
- **型は `types/index.ts` に集約**  
  `Category`, `Step`, `QuizQuestion`, `AnswerRecord`, `ScoreSummary` を共通化し、データ追加・UI 変更時の一貫性を保つ。
- **レイアウト・リスト・教材・クイズ・スコアをコンポーネント分割**  
  レイアウト（`LearningLayout`）と中身（`StepList`, `StepContent`, `QuizCard`, `ScoreDisplay`）を分離し、再利用しやすくしている。

## 状態管理の説明

状態は **React Context**（`LearningContext`）で一元管理しています。

### 保持している状態

| 状態 | 型 | 説明 |
|------|-----|------|
| `category` | `Category \| null` | 現在選択中のカテゴリ（仕様書駆動など） |
| `currentStepId` | `string \| null` | 現在表示している STEP の ID |
| `answers` | `AnswerRecord[]` | 回答履歴（stepId, questionId, 選択肢 index, 正誤, タイムスタンプ） |

### 主な操作

- **`setCategory(category)`**  
  カテゴリを切り替え。同時に `currentStepId` をそのカテゴリの先頭 STEP にし、`answers` をクリア。
- **`setCurrentStepId(stepId)`**  
  左の STEP 一覧でクリックしたときに、表示する STEP を切り替える。
- **`recordAnswer({ stepId, questionId, selectedIndex, isCorrect })`**  
  問題に答えたときに 1 件追加。同一 stepId + questionId の既存履歴は上書きし、最新のみ保持。
- **`getScoreSummary()`**  
  全 STEP の「総問題数」「正解数」「回答済み数」を集計し、スコア表示用のオブジェクトを返す。
- **`getStepAnswerSummary(stepId)`**  
  指定 STEP の「正解数 / 問題数」を返し、左サイドバーのバッジ表示に利用。
- **`resetProgress()`**  
  `answers` を空にして、スコアをリセット（必要に応じて UI から呼ぶ）。

### データの流れ

1. **初回表示**  
   `LearningPage` の `useEffect` で `category` が null のときに `getDefaultCategory()` を `setCategory` に渡し、デフォルトカテゴリをセット。
2. **STEP 切り替え**  
   左の `StepList` で STEP をクリック → `setCurrentStepId(stepId)` → 右の `StepContent` とクイズがその STEP の内容に切り替わる。
3. **回答とスコア**  
   各 `QuizCard` で選択 → `onAnswer` → `recordAnswer` で `answers` に追加。  
   `ScoreDisplay` は `getScoreSummary()` を呼んで表示。`StepList` のバッジは `getStepAnswerSummary(stepId)` を利用。

新しいカテゴリを追加する場合は、`data/categories/` にフォルダを追加し、`Category` 型に沿って `steps` と問題を定義。  
トップページでカテゴリ一覧を出し、選択時に `setCategory` を呼ぶようにすれば、同じ状態管理のまま複数カテゴリに対応できます。
