import { createContext, useReducer, useEffect } from 'react';
import type { Dispatch, ReactNode } from 'react';

interface User {
  _id: string;
  token: string;
  user: {
    email: string;
    name: string;
  };
}

interface AuthState {
  user: User | null;
}

interface AuthAction {
  type: 'SIGNIN' | 'SIGNOUT';
  payload?: User;
}

export interface AuthContextType extends AuthState {
  dispatch: Dispatch<AuthAction>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SIGNIN':
      return {
        user: action.payload || null,
      };
    case 'SIGNOUT':
      return {
        user: null,
      };
    default:
      return state;
  }
};

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') as string);

    if (user) {
      dispatch({ type: 'SIGNIN', payload: user });
    }
  }, []);

  console.log('AuthContext state: ', state);

  return <AuthContext.Provider value={{ ...state, dispatch }}>{children}</AuthContext.Provider>;
};
