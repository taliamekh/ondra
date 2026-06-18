import { useFocusEffect } from 'expo-router';
import { useCallback, useState, type DependencyList } from 'react';

/**
 * Run an async loader on screen focus (and when deps change), tracking
 * loading + data. Refetches whenever the screen regains focus — e.g. after
 * adding an item on another screen.
 */
export function useFocusQuery<T>(loader: () => Promise<T>, deps: DependencyList = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(loader, deps);

  const reload = useCallback(() => {
    let active = true;
    setLoading(true);
    run()
      .then((d) => {
        if (active) setData(d);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [run]);

  useFocusEffect(useCallback(() => reload(), [reload]));

  return { data, loading, reload, setData };
}
