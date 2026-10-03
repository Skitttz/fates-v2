import { ollieCelebrationStyles } from './styles';

export function OllieCelebration({ compact = false }: { compact?: boolean }) {
  const styles = ollieCelebrationStyles();
  if (compact)
    return (
      <p role="status" className={styles.badge()}>
        ★ Ollie cravado
      </p>
    );
  return (
    <div className={styles.root()}>
      <div className={styles.panel()}>
        <p className={styles.title()}>★ Ollie cravado!</p>
        <p className={styles.message()}>Mandou bem, Paulo.</p>
      </div>
    </div>
  );
}
