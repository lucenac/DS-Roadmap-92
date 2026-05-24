'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from './Header.module.css';

export default function Header({ onLoginClick }) {
  const { user, logOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      setMenuOpen(false);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logoGroup}>
          <span className={styles.logoIcon}>🚀</span>
          <h1 className={styles.logo}>
            DS Roadmap <span className={styles.logoAccent}>92</span>
          </h1>
        </div>

        {/* Desktop nav */}
        <nav className={styles.desktopNav}>
          {user ? (
            <div className={styles.userGroup}>
              <span className={styles.userEmail}>{user.email}</span>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Sair
              </button>
            </div>
          ) : (
            <button className={styles.loginBtn} onClick={onLoginClick}>
              Entrar
            </button>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        {user ? (
          <>
            <span className={styles.mobileEmail}>{user.email}</span>
            <button className={styles.mobileBtn} onClick={handleLogout}>
              Sair
            </button>
          </>
        ) : (
          <button
            className={styles.mobileBtn}
            onClick={() => {
              onLoginClick();
              setMenuOpen(false);
            }}
          >
            Entrar
          </button>
        )}
      </div>
    </header>
  );
}
