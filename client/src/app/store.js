import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import expenseReducer from '../features/expenses/expenseSlice';

/**
 * Redux Store Configuration
 * Combines authentication and expense management state slices.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expenseReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
