import styles from './StepContent.module.css';

interface StepContentProps {
  content: string;
}

/**
 * 教材本文の表示
 * ## 見出し / --- 区切り / リスト を簡易的にレンダリング
 */
export function StepContent({ content }: StepContentProps) {
  const blocks = parseContent(content);

  return (
    <article className={styles.article}>
      {blocks.map((block, i) => (
        <div key={i} className={styles.block}>
          {block.type === 'h2' && <h2 className={styles.h2}>{block.text}</h2>}
          {block.type === 'h3' && <h3 className={styles.h3}>{block.text}</h3>}
          {block.type === 'hr' && <hr className={styles.hr} />}
          {block.type === 'p' && <p className={styles.p} dangerouslySetInnerHTML={{ __html: block.html }} />}
          {block.type === 'ul' && (
            <ul className={styles.ul}>
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </article>
  );
}

type Block =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'hr' }
  | { type: 'p'; html: string }
  | { type: 'ul'; items: string[] };

function parseContent(content: string): Block[] {
  const lines = content.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'h2', text: trimmed.slice(3) });
      i++;
      continue;
    }
    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'h3', text: trimmed.slice(4) });
      i++;
      continue;
    }
    if (trimmed === '---') {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }
    if (trimmed.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'));
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }
    if (trimmed) {
      const html = trimmed
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^👉\s*/, '👉 ');
      blocks.push({ type: 'p', html });
      i++;
      continue;
    }
    i++;
  }

  return blocks;
}
