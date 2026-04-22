import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch } = useAuthContext();

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch('/api/user/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.message);
      return false;
    }
    if (response.ok) {
      //save user to local storage
      localStorage.setItem('user', JSON.stringify(json));

      //update auth context
      dispatch({ type: 'SIGNIN', payload: json });

      setIsLoading(false);
      return true;
    }
    return false;
  };

  return { signup, isLoading, error };
};
