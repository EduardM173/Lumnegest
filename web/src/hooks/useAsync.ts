import { useState, useCallback, useRef, useEffect } from 'react';

/**
 *   Uso:
 *   const { data, run, loading, error } = useAsync(() => fetchAlgo(id), [id]);
 *   useEffect(() => { run(); }, [run]);
 */
export function useAsync<T>(fn: () => Promise<T>, deps: any[] = []) {
  /* --------- estado --------- */
  const [data,     setData] = useState<T>();
  const [loading,  setLoad] = useState(false);
  const [error,    setErr ] = useState<string>();

  /* guardamos la versión actual de fn sin recrear run */
  const fnRef = useRef(fn);
  useEffect(() => { fnRef.current = fn; }, deps);

  /* --------- ejecutor estable --------- */
  const run = useCallback(async () => {
    try {
      setLoad(true); setErr(undefined);
      setData(await fnRef.current());
    } catch (e: any) {
      setErr(e?.message ?? 'Error');
    } finally {
      setLoad(false);
    }
  }, []);

  return { data, loading, error, run };
}
