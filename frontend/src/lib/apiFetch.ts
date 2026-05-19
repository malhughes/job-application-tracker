import type { Dispatch } from 'react';

export async function apiFetch(
  url: string,
  options: Parameters<typeof fetch>[1],
  dispatch: Dispatch<{ type: 'SIGNOUT' }>
): Promise<Response> {
  const response = await fetch(url, options);

  if (response.status === 401) {
    localStorage.removeItem('user');
    dispatch({ type: 'SIGNOUT' });
  }

  return response;
}
