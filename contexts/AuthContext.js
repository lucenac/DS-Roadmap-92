'use client';

// Contexto de autenticação do Firebase
// Fornece estado do usuário e funções de autenticação para toda a aplicação

import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

// Cria o contexto de autenticação com valor padrão vazio
const AuthContext = createContext({});

/**
 * Provider de autenticação que envolve a aplicação
 * Gerencia o estado do usuário e expõe funções de login/cadastro/logout
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Observa mudanças no estado de autenticação do Firebase
  // Executa ao montar o componente e limpa o listener ao desmontar
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Limpa o listener ao desmontar o componente para evitar vazamento de memória
    return () => unsubscribe();
  }, []);

  /**
   * Cria uma nova conta com email e senha
   * @param {string} email - Email do novo usuário
   * @param {string} password - Senha do novo usuário
   * @returns {Promise<UserCredential>} Credenciais do usuário criado
   */
  async function signUp(email, password) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      console.error('Erro ao criar conta:', error.message);
      throw error;
    }
  }

  /**
   * Realiza login com email e senha
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<UserCredential>} Credenciais do usuário autenticado
   */
  async function logIn(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
      throw error;
    }
  }

  /**
   * Encerra a sessão do usuário atual
   */
  async function logOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao sair da conta:', error.message);
      throw error;
    }
  }

  // Valores expostos pelo contexto para os componentes filhos
  const value = {
    user,
    loading,
    signUp,
    logIn,
    logOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personalizado para acessar o contexto de autenticação
 * Deve ser usado dentro de um componente envolvido pelo AuthProvider
 * @returns {{ user: object|null, loading: boolean, signUp: function, logIn: function, logOut: function }}
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}
