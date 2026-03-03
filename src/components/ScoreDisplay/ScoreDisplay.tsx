import type { ScoreSummary } from '@/types';
import styles from './ScoreDisplay.module.css';

interface ScoreDisplayProps {
  summary: ScoreSummary;
  label?: string;
}

/**
 * スコア表示コンポーネント
 * 正解数 / 回答数 / 総問題数を表示
 */
export function ScoreDisplay({ summary, label = 'スコア' }: ScoreDisplayProps) {
  const { correctCount, answeredCount, totalQuestions } = summary;
  const percentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <div className={styles.wrapper} role="status" aria-label={`${label}: ${correctCount}/${totalQuestions}問正解`}>
      <span className={styles.label}>{label}</span>
      <div className={styles.scores}>
        <span className={styles.count}>
          <strong>{correctCount}</strong> / {totalQuestions} 問正解
        </span>
        <span className={styles.answered}>
          （回答済み {answeredCount} 問）
        </span>
      </div>
      <div className={styles.bar} role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={styles.barFill}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={styles.percent}>{percentage}%</span>
    </div>
  );
}
