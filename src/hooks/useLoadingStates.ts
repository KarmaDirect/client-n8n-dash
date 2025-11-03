import { useState, useCallback } from 'react';

/**
 * Hook pour gérer les loading states par action
 * Permet d'avoir plusieurs actions en cours simultanément avec des IDs uniques
 * 
 * @example
 * const { isLoading, setLoading, clearLoading } = useLoadingStates();
 * 
 * // Dans une fonction
 * const handleAction = async (id: string) => {
 *   setLoading(id);
 *   try {
 *     await doSomething();
 *   } finally {
 *     clearLoading(id);
 *   }
 * };
 * 
 * // Dans le JSX
 * <Button disabled={isLoading('action-1')}>
 *   {isLoading('action-1') ? 'Chargement...' : 'Action'}
 * </Button>
 */
export function useLoadingStates() {
  const [loadingStates, setLoadingStates] = useState<Set<string>>(new Set());

  const setLoading = useCallback((id: string) => {
    setLoadingStates(prev => new Set(prev).add(id));
  }, []);

  const clearLoading = useCallback((id: string) => {
    setLoadingStates(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const isLoading = useCallback((id: string) => {
    return loadingStates.has(id);
  }, [loadingStates]);

  const clearAll = useCallback(() => {
    setLoadingStates(new Set());
  }, []);

  return {
    isLoading,
    setLoading,
    clearLoading,
    clearAll,
    loadingStates: Array.from(loadingStates),
  };
}

