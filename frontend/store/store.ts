import { useEffect, useState } from 'react';

export default function useGetFromStore(store: any, callback: any) {
  const result = store(callback);
  const [state, setState] = useState();
  useEffect(() => {
    setState(result);
  }, [result]);
  return state;
}
