/**
 * 学習サイト共通型定義
 * カテゴリ・STEP・問題はこの型に従い、将来の拡張に対応する
 */

/** 1問の選択式問題 */
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

/** 1つのSTEPが持つ問題セット */
export interface StepQuiz {
  questions: QuizQuestion[];
}

/** 1つのSTEP（教材＋問題） */
export interface Step {
  id: string;
  order: number;
  title: string;
  content: string;
  quiz: StepQuiz;
}

/** 技術カテゴリ（例: 仕様書駆動開発, つくりながら学ぶReact） */
export interface Category {
  id: string;
  name: string;
  description: string;
  steps: Step[];
}

/** ユーザーの1問への回答結果 */
export interface AnswerRecord {
  stepId: string;
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  answeredAt: number;
}

/** スコア集計用 */
export interface ScoreSummary {
  totalQuestions: number;
  correctCount: number;
  answeredCount: number;
}
