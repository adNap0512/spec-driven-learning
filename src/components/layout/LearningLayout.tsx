import type { ReactNode } from 'react';
import styles from './LearningLayout.module.css';

interface LearningLayoutProps {
  sidebar: ReactNode;
  main: ReactNode;
}

/**
 * 左：STEP一覧、右：教材エリアの2カラムレイアウト
 * 再利用可能なレイアウトコンポーネント
 */
export function LearningLayout({ sidebar, main }: LearningLayoutProps) {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>{sidebar}</aside>
      <main className={styles.main}>{main}</main>
    </div>
  );
}
