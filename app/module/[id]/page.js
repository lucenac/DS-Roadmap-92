'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ModuleView from '@/components/ModuleView';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import { getModuleById } from '@/lib/data';

export default function ModulePage({ params }) {
  const router = useRouter();
  // Unwrap params em Next 15+ (no Next 13/14 é síncrono mas não faz mal dar unwrap para compatibilidade futura).
  const { id } = use(params); 
  const moduleId = parseInt(id, 10);
  
  const { user, logIn, signUp, loading: authLoading } = useAuth();
  const { 
    completedDays, 
    loadingProgress, 
    toggleDay, 
    isAuthModalOpen, 
    setIsAuthModalOpen 
  } = useProgress();

  const activeModule = getModuleById(moduleId);

  useEffect(() => {
    if (!activeModule) {
      router.push('/');
    }
  }, [activeModule, router]);

  if (!activeModule) {
    return null; // redirecting
  }

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
            <ModuleView 
              moduleId={moduleId}
              moduleData={activeModule}
              completedDays={completedDays}
              onToggleDay={toggleDay}
              onBack={() => router.push('/')}
            />
          </div>
        )}
      </div>

      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)} 
          onLogin={logIn} 
          onSignup={signUp} 
        />
      )}
    </main>
  );
}
