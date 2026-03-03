import { useEffect, useMemo } from 'react';
import { LearningLayout } from '@/components/layout/LearningLayout';
import { StepList } from '@/components/StepList/StepList';
import { StepContent } from '@/components/StepContent/StepContent';
import { QuizCard } from '@/components/QuizCard/QuizCard';
import { ScoreDisplay } from '@/components/ScoreDisplay/ScoreDisplay';
import { useLearning } from '@/context/LearningContext';
import { getDefaultCategory } from '@/data/categories';

function shuffleOptions(options: string[], correctIndex: number): { options: string[]; correctIndex: number } {
  const indices = options.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const shuffled = indices.map((i) => options[i]);
  const newCorrectIndex = indices.indexOf(correctIndex);
  return { options: shuffled, correctIndex: newCorrectIndex };
}

export function LearningPage() {
  const {
    category,
    currentStepId,
    setCategory,
    recordAnswer,
    getScoreSummary,
  } = useLearning();

  useEffect(() => {
    if (!category) {
      setCategory(getDefaultCategory());
    }
  }, [category, setCategory]);

  const currentStep = useMemo(
    () => category?.steps.find((s) => s.id === currentStepId) ?? null,
    [category, currentStepId]
  );

  if (!category) {
    return <div className="learning-loading">読み込み中...</div>;
  }

  const summary = getScoreSummary();

  const sidebar = (
    <>
      <header className="learning-sidebar-header">
        <h2 className="learning-sidebar-title">{category.name}</h2>
        <ScoreDisplay summary={summary} />
      </header>
      <StepList steps={category.steps} />
    </>
  );

  const main = currentStep ? (
    <div className="learning-main-inner">
      <h1 className="learning-step-title">
        STEP{currentStep.order}：{currentStep.title}
      </h1>
      <StepContent content={currentStep.content} />
      <section className="learning-quiz-section" aria-label="確認問題">
        <h2 className="learning-quiz-heading">確認問題</h2>
        {currentStep.quiz.questions.map((q) => (
          <StepQuestionCard
            key={q.id}
            question={q}
            stepId={currentStep.id}
            onRecordAnswer={recordAnswer}
          />
        ))}
      </section>
    </div>
  ) : (
    <p>STEPを選択してください。</p>
  );

  return <LearningLayout sidebar={sidebar} main={main} />;
}

/** 1問ごとにシャッフルを固定するためのラッパー */
function StepQuestionCard({
  question,
  stepId,
  onRecordAnswer,
}: {
  question: { id: string; question: string; options: string[]; correctIndex: number; explanation?: string };
  stepId: string;
  onRecordAnswer: (record: { stepId: string; questionId: string; selectedIndex: number; isCorrect: boolean }) => void;
}) {
  const { options, correctIndex } = useMemo(
    () => shuffleOptions(question.options, question.correctIndex),
    [stepId, question.id]
  );
  return (
    <QuizCard
      question={question.question}
      options={options}
      correctIndex={correctIndex}
      explanation={question.explanation}
      onAnswer={(selectedIndex, isCorrect) =>
        onRecordAnswer({ stepId, questionId: question.id, selectedIndex, isCorrect })
      }
    />
  );
}
