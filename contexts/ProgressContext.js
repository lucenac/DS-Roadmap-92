'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserProgress, toggleDayCompletion } from '@/lib/progress';

const ProgressContext = createContext({});

export function ProgressProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [completedDays, setCompletedDays] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    async function loadProgress() {
      if (!user) {
        setCompletedDays([]);
        setLoadingProgress(false);
        return;
      }
      
      try {
        setLoadingProgress(true);
        const days = await getUserProgress(user.uid);
        setCompletedDays(days);
      } catch (error) {
        console.error("Erro ao carregar progresso:", error);
      } finally {
        setLoadingProgress(false);
      }
    }
    
    if (!authLoading) {
      loadProgress();
    }
  }, [user, authLoading]);

  const toggleDay = async (dayNumber) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    // Optimistic UI update
    const isCompleted = completedDays.includes(dayNumber);
    const newCompletedDays = isCompleted 
      ? completedDays.filter(d => d !== dayNumber)
      : [...completedDays, dayNumber].sort((a, b) => a - b);
      
    setCompletedDays(newCompletedDays);

    // Persist to Firebase
    try {
      await toggleDayCompletion(user.uid, dayNumber);
    } catch (error) {
      console.error("Erro ao salvar progresso:", error);
      // Revert on error
      setCompletedDays(completedDays);
    }
  };

  const value = {
    completedDays,
    loadingProgress,
    toggleDay,
    isAuthModalOpen,
    setIsAuthModalOpen,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress deve ser usado dentro de um ProgressProvider');
  }
  return context;
}
