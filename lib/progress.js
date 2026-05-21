// Funções de acompanhamento de progresso do usuário
// Gerencia os dias concluídos e calcula estatísticas de conclusão

import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { MODULES, SCHEDULE } from './data';

/**
 * Busca o progresso do usuário no Firestore
 * Retorna um array com os números dos dias concluídos
 * @param {string} userId - ID do usuário autenticado
 * @returns {Promise<number[]>} Array de dias concluídos
 */
export async function getUserProgress(userId) {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Retorna os dias concluídos ou um array vazio se não houver dados
      return userDoc.data().completedDays || [];
    }

    // Se o documento do usuário não existir, retorna array vazio
    return [];
  } catch (error) {
    console.error('Erro ao buscar progresso do usuário:', error);
    return [];
  }
}

/**
 * Alterna o status de conclusão de um dia específico
 * Se o dia já estiver concluído, remove da lista; caso contrário, adiciona
 * @param {string} userId - ID do usuário autenticado
 * @param {number} day - Número do dia a ser alternado
 * @returns {Promise<number[]>} Array atualizado de dias concluídos
 */
export async function toggleDayCompletion(userId, day) {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    let completedDays = [];

    if (userDoc.exists()) {
      completedDays = userDoc.data().completedDays || [];
    }

    // Verifica se o dia já está na lista de concluídos
    const dayIndex = completedDays.indexOf(day);

    if (dayIndex > -1) {
      // Dia já concluído — remove da lista (desmarca)
      completedDays.splice(dayIndex, 1);
    } else {
      // Dia não concluído — adiciona à lista (marca como concluído)
      completedDays.push(day);
    }

    // Ordena os dias para manter consistência
    completedDays.sort((a, b) => a - b);

    if (userDoc.exists()) {
      // Atualiza o documento existente
      await updateDoc(userDocRef, {
        completedDays,
        lastUpdated: new Date().toISOString(),
      });
    } else {
      // Cria um novo documento para o usuário
      await setDoc(userDocRef, {
        completedDays,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      });
    }

    return completedDays;
  } catch (error) {
    console.error('Erro ao alternar conclusão do dia:', error);
    throw error;
  }
}

/**
 * Calcula estatísticas detalhadas de conclusão do cronograma
 * Inclui total geral e progresso por módulo
 * @param {number[]} completedDays - Array com os números dos dias concluídos
 * @returns {Object} Estatísticas de conclusão
 */
export function getCompletionStats(completedDays) {
  // Total de dias no cronograma
  const totalDays = SCHEDULE.length;
  const totalCompleted = completedDays.length;
  const percentage = totalDays > 0 ? Math.round((totalCompleted / totalDays) * 100) : 0;

  // Calcula o progresso por módulo
  const moduleStats = MODULES.map((module) => {
    // Filtra os dias do cronograma que pertencem a este módulo
    const moduleDays = SCHEDULE.filter(
      (scheduleDay) => scheduleDay.module === module.id
    );

    // Conta quantos dias deste módulo foram concluídos
    const moduleCompleted = moduleDays.filter((scheduleDay) =>
      completedDays.includes(scheduleDay.day)
    ).length;

    const moduleTotal = moduleDays.length;
    const modulePercentage =
      moduleTotal > 0 ? Math.round((moduleCompleted / moduleTotal) * 100) : 0;

    return {
      id: module.id,
      name: module.name,
      completed: moduleCompleted,
      total: moduleTotal,
      percentage: modulePercentage,
    };
  });

  return {
    totalCompleted,
    totalDays,
    percentage,
    moduleStats,
  };
}
