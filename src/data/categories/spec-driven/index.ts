import type { Category } from '@/types';
import { specDrivenSteps } from './steps';

/**
 * 仕様書駆動開発（Spec Driven）カテゴリ
 */
export const specDrivenCategory: Category = {
  id: 'spec-driven',
  name: '仕様書駆動開発（Spec Driven）',
  description: '仕様を先に定義し、曖昧さを排除してから実装する開発手法を学びます。',
  steps: specDrivenSteps,
};
