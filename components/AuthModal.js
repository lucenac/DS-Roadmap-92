'use client';

import { useState } from 'react';
import styles from './AuthModal.module.css';

export default function AuthModal({ onClose, onLogin, onSignup }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.trim()) return 'Insira seu e-mail.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return 'E-mail inválido.';
    if (password.length < 6) return 'A senha deve ter pelo menos 6 caracteres.';
    if (mode === 'signup' && password !== confirmPassword)
      return 'As senhas não coincidem.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await onLogin(email, password);
      } else {
        await onSignup(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
    setError('');
    setConfirmPassword('');
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <h2 className={styles.title}>
          {mode === 'login' ? 'Bem-vindo de volta' : 'Criar conta'}
        </h2>
        <p className={styles.subtitle}>
          {mode === 'login'
            ? 'Entre para acompanhar seu progresso'
            : 'Crie uma conta para salvar seu progresso'}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            <span>E-mail</span>
            <input
              className={styles.input}
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </label>

          <label className={styles.label}>
            <span>Senha</span>
            <input
              className={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {mode === 'signup' && (
            <label className={styles.label}>
              <span>Confirmar senha</span>
              <input
                className={styles.input}
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? (
              <span className={styles.spinner} />
            ) : mode === 'login' ? (
              'Entrar'
            ) : (
              'Cadastrar'
            )}
          </button>
        </form>

        <p className={styles.switchText}>
          {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
          <button className={styles.switchBtn} onClick={switchMode} type="button">
            {mode === 'login' ? 'Cadastre-se' : 'Faça login'}
          </button>
        </p>
      </div>
    </div>
  );
}
