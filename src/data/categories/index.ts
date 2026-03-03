import type { Category } from '@/types';
import { specDrivenCategory } from './spec-driven';

/**
 * 全カテゴリの登録窓口
 * 新しいカテゴリを追加する場合はここに登録する
 */
export const categories: Category[] = [specDrivenCategory];

/** カテゴリIDで取得 */
export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

/** デフォルト表示用の最初のカテゴリ */
export function getDefaultCategory(): Category {
  return categories[0];
}
