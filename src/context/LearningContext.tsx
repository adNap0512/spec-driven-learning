import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Category, AnswerRecord, ScoreSummary } from '@/types';

interface LearningState {
  category: Category | null;
  currentStepId: string | null;
  answers: AnswerRecord[];
}

interface LearningContextValue extends LearningState {
  setCategory: (category: Category) => void;
  setCurrentStepId: (stepId: string) => void;
  recordAnswer: (record: Omit<AnswerRecord, 'answeredAt'>) => void;
  getScoreSummary: () => ScoreSummary;
  getStepAnswerSummary: (stepId: string) => { correct: number; total: number };
  resetProgress: () => void;
}

const initialState: LearningState = {
  category: null,
  currentStepId: null,
  answers: [],
};

const LearningContext = createContext<LearningContextValue | null>(null);

export function LearningProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LearningState>(initialState);

  const setCategory = useCallback((category: Category) => {
    setState((prev) => ({
      ...prev,
      category,
      currentStepId: category.steps[0]?.id ?? null,
      answers: [],
    }));
  }, []);

  const setCurrentStepId = useCallback((stepId: string) => {
    setState((prev) => ({ ...prev, currentStepId: stepId }));
  }, []);

  const recordAnswer = useCallback(
    (record: Omit<AnswerRecord, 'answeredAt'>) => {
      setState((prev) => ({
        ...prev,
        answers: [
          ...prev.answers.filter(
            (a) => !(a.stepId === record.stepId && a.questionId === record.questionId)
          ),
          { ...record, answeredAt: Date.now() },
        ],
      }));
    },
    []
  );

  const getScoreSummary = useCallback((): ScoreSummary => {
    const answers = state.answers;
    const totalQuestions = state.category?.steps.reduce(
      (acc, s) => acc + s.quiz.questions.length,
      0
    ) ?? 0;
    const uniqueByQuestion = new Map(
      answers.map((a) => [`${a.stepId}-${a.questionId}`, a])
    );
    const answeredCount = uniqueByQuestion.size;
    const correctCount = [...uniqueByQuestion.values()].filter((a) => a.isCorrect).length;
    return {
      totalQuestions,
      correctCount,
      answeredCount,
    };
  }, [state.answers, state.category]);

  const getStepAnswerSummary = useCallback(
    (stepId: string): { correct: number; total: number } => {
      const step = state.category?.steps.find((s) => s.id === stepId);
      if (!step) return { correct: 0, total: 0 };
      const stepAnswers = state.answers.filter((a) => a.stepId === stepId);
      const correct = stepAnswers.filter((a) => a.isCorrect).length;
      const total = step.quiz.questions.length;
      return { correct, total };
    },
    [state.category, state.answers]
  );

  const resetProgress = useCallback(() => {
    setState((prev) => ({
      ...prev,
      answers: [],
    }));
  }, []);

  const value = useMemo<LearningContextValue>(
    () => ({
      ...state,
      setCategory,
      setCurrentStepId,
      recordAnswer,
      getScoreSummary,
      getStepAnswerSummary,
      resetProgress,
    }),
    [
      state,
      setCategory,
      setCurrentStepId,
      recordAnswer,
      getScoreSummary,
      getStepAnswerSummary,
      resetProgress,
    ]
  );

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning(): LearningContextValue {
  const ctx = useContext(LearningContext);
  if (!ctx) {
    throw new Error('useLearning must be used within LearningProvider');
  }
  return ctx;
}
