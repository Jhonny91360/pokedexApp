import {useEffect, useState} from 'react';

export const useDebounceValue = (input: string = '', time = 300) => {
  const [debounceValue, setDebounceValue] = useState(input);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(input);
    }, time);
    return () => {
      clearTimeout(handler);
    };
  }, [input]);

  return debounceValue;
};
