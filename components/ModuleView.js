'use client';

import { useState, useMemo } from 'react';
import { MODULES, SCHEDULE } from '@/lib/data';
import DayCard from './DayCard';
import styles from './ModuleView.module.css';

const FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'pending', label: 'Pendentes' },
  { key: 'completed', label: 'Concluídos' },
];

export default function ModuleView({ moduleId, completedDays = [], onToggleDay, onBack }) {
  const [filter, setFilter] = useState('all');

  const mod = MODULES.find((m) => m.id === moduleId) || MODULES[0];

  const days = useMemo(() => {
    if (moduleId === 0) return SCHEDULE;
    return SCHEDULE.filter((d) => d.module === moduleId);
  }, [moduleId]);

  const filteredDays = useMemo(() => {
    if (filter === 'pending') return days.filter((d) => !completedDays.includes(d.day));
    if (filter === 'completed') return days.filter((d) => completedDays.includes(d.day));
    return days;
  }, [days, filter, completedDays]);

  const completedInModule = days.filter((d) => completedDays.includes(d.day)).length;
  const totalInModule = days.length;
  const pct = totalInModule ? Math.round((completedInModule / totalInModule) * 100) : 0;

  return (
    <section className={styles.moduleView}>
      {/* Back */}
      <button className={styles.backBtn} onClick={onBack}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Voltar
      </button>

      {/* Module header */}
      <div className={styles.header} style={{ '--mod-color': mod.color }}>
        <div className={styles.headerTop}>
          <span className={styles.headerIcon}>{mod.icon}</span>
          <div className={styles.headerInfo}>
            <h2 className={styles.headerName}>{mod.name}</h2>
            <p className={styles.headerRange}>{mod.range}</p>
          </div>
          <span className={styles.headerPct}>{pct}%</span>
        </div>

        {/* Progress bar */}
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${pct}%`, background: mod.color }}
          />
        </div>

        <p className={styles.headerStats}>
          <strong>{completedInModule}</strong> de <strong>{totalInModule}</strong> dias concluídos
        </p>
      </div>

      {/* Filter controls */}
      <div className={styles.filters}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`${styles.filterBtn} ${filter === f.key ? styles.filterActive : ''}`}
            onClick={() => setFilter(f.key)}
            style={filter === f.key ? { '--active-color': mod.color } : {}}
          >
            {f.label}
            {f.key === 'pending' && (
              <span className={styles.badge}>{totalInModule - completedInModule}</span>
            )}
            {f.key === 'completed' && (
              <span className={styles.badge}>{completedInModule}</span>
            )}
          </button>
        ))}
      </div>

      {/* Day list */}
      <div className={styles.dayList}>
        {filteredDays.length === 0 ? (
          <p className={styles.emptyMsg}>
            {filter === 'completed'
              ? 'Nenhum dia concluído ainda.'
              : 'Todos os dias foram concluídos! 🎉'}
          </p>
        ) : (
          filteredDays.map((day) => (
            <DayCard
              key={day.day}
              day={day}
              isCompleted={completedDays.includes(day.day)}
              onToggle={onToggleDay}
              moduleColor={mod.color}
            />
          ))
        )}
      </div>
    </section>
  );
}
