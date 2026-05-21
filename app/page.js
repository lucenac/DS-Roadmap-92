'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import ModuleView from '@/components/ModuleView';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProgress, toggleDayCompletion } from '@/lib/progress';
import { getModuleById } from '@/lib/data';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [completedDays, setCompletedDays] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Fetch progress when user changes
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

  // Handle toggling a day
  const handleToggleDay = async (dayNumber) => {
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

  const handleModuleSelect = (moduleId) => {
    setActiveModuleId(moduleId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDashboard = () => {
    setActiveModuleId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeModule = activeModuleId !== null ? getModuleById(activeModuleId) : null;

  return (
    <main className="min-h-screen">
      <Header onLoginClick={() => setIsAuthModalOpen(true)} />
      
      <div className="container" style={{ paddingBottom: '4rem' }}>
        {authLoading || (user && loadingProgress) ? (
          <div className="loading-state glass fade-in" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
            <div className="animate-spin" style={{ fontSize: '2rem', margin: '0 auto 1rem', width: 'fit-content' }}>⏳</div>
            <p style={{ opacity: 0.7 }}>Carregando seu progresso...</p>
          </div>
        ) : (
          <div className="fade-in">
            {!user && (
              <div className="glass fade-in" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '4px solid #7F77DD', borderRadius: '8px' }}>
                <p>👋 <strong>Bem-vindo ao DS Roadmap 92!</strong> Faça login para acompanhar e salvar seu progresso de 92 dias de estudos em Ciência de Dados.</p>
              </div>
            )}
            
            {activeModuleId === null ? (
              <Dashboard 
                completedDays={completedDays} 
                onModuleSelect={handleModuleSelect} 
              />
            ) : (
              <ModuleView 
                moduleId={activeModuleId}
                moduleData={activeModule}
                completedDays={completedDays}
                onToggleDay={handleToggleDay}
                onBack={handleBackToDashboard}
              />
            )}
          </div>
        )}
      </div>

      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </main>
  );
}
