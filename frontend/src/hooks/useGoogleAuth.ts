import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useGoogleAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const googleAuth = async (accessToken: string) => {
    setIsLoading(true);
    setError(null);

    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userInfoRes.ok) {
      setError('Failed to fetch Google user info');
      setIsLoading(false);
      return false;
    }

    const { sub, email, given_name } = await userInfoRes.json();

    const response = await fetch('/api/user/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ googleId: sub, email, name: given_name }),
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.message);
      setIsLoading(false);
      return false;
    }

    localStorage.setItem('user', JSON.stringify(json));
    dispatch({ type: 'SIGNIN', payload: json });
    setIsLoading(false);
    return true;
  };

  return { googleAuth, isLoading, error };
};
