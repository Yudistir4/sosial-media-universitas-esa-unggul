import * as React from 'react';

const useClickOutside = <T extends HTMLElement>(
  handler: () => void
): React.RefObject<T> => {
  const ref = React.useRef<T>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handler]);

  return ref;
};

export default useClickOutside;
