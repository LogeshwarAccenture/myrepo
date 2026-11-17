import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type State<T> = { loading: true } | { loading: false; data: T } | { loading: false; error: Error };

export function useFetch<T>(path: string): State<T> {
  const [state, setState] = useState<State<T>>({ loading: true });

  useEffect(() => {
    getJson<T>(path)
      .then((data) => setState({ loading: false, data }))
      .catch((error) => setState({ loading: false, error: error instanceof Error ? error : new Error(String(error)) }));
  }, [path]);

  return state;
}
