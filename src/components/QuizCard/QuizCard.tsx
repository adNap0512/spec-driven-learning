import { useState } from 'react';
import styles from './QuizCard.module.css';

export interface QuizCardOption {
  text: string;
  index: number;
  isCorrect: boolean;
  isSelected: boolean;
}

interface QuizCardProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  onAnswer: (selectedIndex: number, isCorrect: boolean) => void;
  disabled?: boolean;
}

/**
 * 選択式問題カード
 * 回答後は正誤と解説を表示
 */
export function QuizCard({
  question,
  options,
  correctIndex,
  explanation,
  onAnswer,
  disabled = false,
}: QuizCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index: number) => {
    if (disabled || showResult || selectedIndex !== null) return;
    setSelectedIndex(index);
    setShowResult(true);
    const isCorrect = index === correctIndex;
    onAnswer(index, isCorrect);
  };

  const isCorrect = selectedIndex === correctIndex;

  return (
    <div className={styles.card}>
      <h3 className={styles.question}>{question}</h3>
      <ul className={styles.options} role="listbox" aria-label="選択肢">
        {options.map((text, index) => {
          const isSelected = selectedIndex === index;
          const isCorrectOption = index === correctIndex;
          const showAsCorrect = showResult && isCorrectOption;
          const showAsWrong = showResult && isSelected && !isCorrectOption;

          return (
            <li key={index}>
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                aria-disabled={disabled || showResult}
                className={`${styles.option} ${
                  showAsCorrect ? styles.optionCorrect : ''
                } ${showAsWrong ? styles.optionWrong : ''} ${
                  showResult ? styles.optionRevealed : ''
                }`}
                onClick={() => handleSelect(index)}
                disabled={disabled || showResult}
              >
                <span className={styles.optionMarker}>{index + 1}.</span>
                <span className={styles.optionText}>{text}</span>
                {showAsCorrect && <span className={styles.badge} aria-hidden>正解</span>}
                {showAsWrong && <span className={styles.badgeWrong} aria-hidden>不正解</span>}
              </button>
            </li>
          );
        })}
      </ul>
      {showResult && explanation && (
        <div
          className={`${styles.explanation} ${isCorrect ? styles.explanationCorrect : styles.explanationWrong}`}
          role="status"
        >
          <strong>{isCorrect ? '正解です！' : '不正解です'}</strong>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
}
