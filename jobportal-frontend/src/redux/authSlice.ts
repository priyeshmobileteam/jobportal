import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthResponse } from '../types';

interface AuthState {
  token: string | null;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    isPremium?: boolean;
  } | null;
  isAuthenticated: boolean;
}

const getInitialState = (): AuthState => {
  const cached = localStorage.getItem('auth');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      return {
        token: parsed.token,
        user: {
          id: parsed.id,
          email: parsed.email,
          firstName: parsed.firstName,
          lastName: parsed.lastName,
          roles: parsed.roles,
          isPremium: parsed.isPremium || false,
        },
        isAuthenticated: true,
      };
    } catch {
      localStorage.removeItem('auth');
    }
  }
  return {
    token: null,
    user: null,
    isAuthenticated: false,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      state.token = action.payload.token;
      state.user = {
        id: action.payload.id,
        email: action.payload.email,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        roles: action.payload.roles,
        isPremium: action.payload.isPremium || false,
      };
      state.isAuthenticated = true;
      localStorage.setItem('auth', JSON.stringify(action.payload));
    },
    upgradeToPremium: (state) => {
      if (state.user) {
        state.user.isPremium = true;
        // Update local storage too
        const cached = localStorage.getItem('auth');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            parsed.isPremium = true;
            localStorage.setItem('auth', JSON.stringify(parsed));
          } catch (e) {}
        }
      }
    },
    logOut: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('auth');
    },
  },
});

export const { setCredentials, logOut, upgradeToPremium } = authSlice.actions;
export default authSlice.reducer;
export type { AuthState };
