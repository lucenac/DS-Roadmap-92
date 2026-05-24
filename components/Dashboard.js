'use client';

import { useState, useEffect, useMemo } from 'react';
import { MODULES } from '@/lib/data';
import { getCompletionStats } from '@/lib/progress';
import styles from './Dashboard.module.css';

function useAnimatedCounter(target, duration = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

/* ── Progress Ring ── */
function ProgressRing({ pct, size = 180, stroke = 10 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);

  return (
    <svg className={styles.ring} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={stroke}
      />
      <circle
        className={styles.ringProgress}
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="url(#grad)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7f77dd" />
          <stop offset="50%" stopColor="#378add" />
          <stop offset="100%" stopColor="#1d9e75" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Dashboard ── */
export default function Dashboard({ completedDays = [], onModuleSelect }) {
  const stats = useMemo(() => getCompletionStats(completedDays), [completedDays]);
  
  const totalDays = stats.totalDays;
  const completedCount = stats.totalCompleted;
  const pct = stats.percentage;

  const animatedPct = useAnimatedCounter(pct);
  const animatedDone = useAnimatedCounter(completedCount);

  const moduleStats = useMemo(() => {
    return stats.moduleStats
      .filter((m) => m.id !== 0)
      .map((modStat) => {
        const originalMod = MODULES.find((m) => m.id === modStat.id);
        return {
          ...originalMod,
          total: modStat.total,
          done: modStat.completed,
          pct: modStat.percentage,
        };
      });
  }, [stats]);

  return (
    <section className={styles.dashboard}>
      {/* Hero progress */}
      <div className={styles.hero}>
        <div className={styles.ringWrap}>
          <ProgressRing pct={pct} />
          <div className={styles.ringLabel}>
            <span className={styles.ringPct}>{animatedPct}%</span>
            <span className={styles.ringCaption}>concluído</span>
          </div>
        </div>

        <div className={styles.heroStats}>
          <h2 className={styles.heroTitle}>Seu progresso</h2>
          <p className={styles.heroDays}>
            <strong>{animatedDone}</strong> de <strong>{totalDays}</strong> dias concluídos
          </p>
        </div>
      </div>

      {/* Module grid */}
      <h3 className={styles.sectionTitle}>Módulos</h3>
      <div className={styles.grid}>
        {moduleStats.map((mod) => (
          <button
            key={mod.id}
            className={styles.card}
            onClick={() => onModuleSelect(mod.id)}
            style={{ '--mod-color': mod.color }}
          >
            <div className={styles.cardHead}>
              <span className={styles.cardIcon}>{mod.icon}</span>
              <span className={styles.cardPct}>{mod.pct}%</span>
            </div>
            <h4 className={styles.cardName}>{mod.name}</h4>
            <p className={styles.cardRange}>{mod.range}</p>

            {/* Mini progress bar */}
            <div className={styles.miniBar}>
              <div
                className={styles.miniBarFill}
                style={{ width: `${mod.pct}%`, background: mod.color }}
              />
            </div>

            <p className={styles.cardCount}>
              {mod.done}/{mod.total} dias
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
