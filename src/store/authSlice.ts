import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';

import { storage } from '@/helpers/storage';
import { startAppListening } from '@/store/listener';
import { STORAGE_KEY } from '@/helpers/constants';
import { type Credentials, credentialsSchema } from '@/helpers/schema';

interface AuthState {
  credentials: Credentials | null;
}

const initialState: AuthState = {
  credentials: storage.get(STORAGE_KEY, credentialsSchema),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logIn: (state, action: PayloadAction<Credentials>) => {
      state.credentials = action.payload;
    },
    logOut: (state) => {
      state.credentials = null;
    },
  },
  selectors: {
    selectCredentials: (state) => state.credentials,
  },
});

export const { logIn, logOut } = authSlice.actions;
export const { selectCredentials } = authSlice.selectors;

startAppListening({
  matcher: isAnyOf(logIn, logOut),
  effect: (_, { getState }) => {
    const { credentials } = getState().auth;

    if (credentials) {
      storage.set(STORAGE_KEY, credentials);
    } else {
      storage.remove(STORAGE_KEY);
    }
  },
});
