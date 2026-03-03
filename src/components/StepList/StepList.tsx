import type { Step } from '@/types';
import { useLearning } from '@/context/LearningContext';
import styles from './StepList.module.css';

interface StepListProps {
  steps: Step[];
}

/**
 * 左サイドバー用：STEP一覧
 * 現在選択中のSTEPをハイライトし、クリックで切り替え
 */
export function StepList({ steps }: StepListProps) {
  const { currentStepId, setCurrentStepId, getStepAnswerSummary } = useLearning();

  return (
    <nav className={styles.list} aria-label="STEP一覧">
      <ul className={styles.ul}>
        {steps.map((step) => {
          const isActive = currentStepId === step.id;
          const { correct, total } = getStepAnswerSummary(step.id);
          const allCorrect = total > 0 && correct === total;

          return (
            <li key={step.id} className={styles.li}>
              <button
                type="button"
                className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                onClick={() => setCurrentStepId(step.id)}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className={styles.order}>STEP{step.order}</span>
                <span className={styles.title}>{step.title}</span>
                {total > 0 && (
                  <span
                    className={`${styles.badge} ${allCorrect ? styles.badgeDone : ''}`}
                    aria-label={`${correct}/${total}問正解`}
                  >
                    {correct}/{total}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
