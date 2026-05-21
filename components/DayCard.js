'use client';

import { useState } from 'react';
import styles from './DayCard.module.css';

export default function DayCard({ day, isCompleted, onToggle, moduleColor }) {
  const [expanded, setExpanded] = useState(false);

  const handleCheckbox = (e) => {
    e.stopPropagation();
    onToggle(day.day);
  };

  return (
    <div
      className={`${styles.card} ${expanded ? styles.expanded : ''} ${isCompleted ? styles.completed : ''}`}
      style={{ '--mod-color': moduleColor }}
    >
      {/* Collapsed row */}
      <div className={styles.row} onClick={() => setExpanded((v) => !v)}>
        <div className={styles.leftGroup}>
          <span className={styles.dayNumber}>Dia {day.day}</span>
          <span className={styles.subject}>{day.subject}</span>
        </div>

        <div className={styles.rightGroup}>
          {/* Chevron */}
          <svg
            className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}
            width="18" height="18" viewBox="0 0 18 18" fill="none"
          >
            <path d="M5 7l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          {/* Checkbox */}
          <button
            className={`${styles.checkbox} ${isCompleted ? styles.checked : ''}`}
            onClick={handleCheckbox}
            aria-label={isCompleted ? 'Desmarcar' : 'Marcar como concluído'}
          >
            <svg className={styles.checkSvg} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                className={styles.checkPath}
                d="M3.5 8.5L6.5 11.5L12.5 4.5"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Expandable body */}
      <div className={styles.body}>
        <div className={styles.bodyInner}>
          {day.objective && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Objetivo</h4>
              <p className={styles.sectionText}>{day.objective}</p>
            </div>
          )}

          {day.topics && day.topics.length > 0 && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Tópicos</h4>
              <ul className={styles.topicList}>
                {day.topics.map((t, i) => (
                  <li key={i} className={styles.topicItem}>
                    <span className={styles.topicBullet} style={{ background: moduleColor }} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
