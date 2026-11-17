import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  expenses: [],
  currentExpense: null, // holds the expense currently selected for editing
  isLoading: false,
  isError: false,
  errorMessage: '',
  successMessage: '',
};

/**
 * Async Thunk: Fetch Expenses with optional category & search filter
 */
export const fetchExpenses = createAsyncThunk(
  'expenses/fetchAll',
  async (filters = {}, thunkAPI) => {
    try {
      const { category, search } = filters;
      const params = {};
      if (category && category !== 'All') params.category = category;
      if (search && search.trim() !== '') params.search = search.trim();

      const response = await api.get('/expenses', { params });
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch expenses';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * Async Thunk: Add Expense
 */
export const addExpense = createAsyncThunk(
  'expenses/add',
  async (expenseData, thunkAPI) => {
    try {
      const response = await api.post('/expenses', expenseData);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to add expense';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * Async Thunk: Update Expense
 */
export const updateExpense = createAsyncThunk(
  'expenses/update',
  async ({ id, expenseData }, thunkAPI) => {
    try {
      const response = await api.put(`/expenses/${id}`, expenseData);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to update expense';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * Async Thunk: Delete Expense
 */
export const deleteExpense = createAsyncThunk(
  'expenses/delete',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/expenses/${id}`);
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to delete expense';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setCurrentExpense: (state, action) => {
      state.currentExpense = action.payload;
    },
    clearCurrentExpense: (state) => {
      state.currentExpense = null;
    },
    clearExpenseMessages: (state) => {
      state.isError = false;
      state.errorMessage = '';
      state.successMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      // Add Expense
      .addCase(addExpense.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        // Prepend new expense to the top of list
        state.expenses = [action.payload, ...state.expenses];
        state.successMessage = 'Expense added successfully!';
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      // Update Expense
      .addCase(updateExpense.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = state.expenses.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
        state.currentExpense = null; // Exit edit mode
        state.successMessage = 'Expense updated successfully!';
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      // Delete Expense
      .addCase(deleteExpense.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = state.expenses.filter((item) => item._id !== action.payload);
        if (state.currentExpense?._id === action.payload) {
          state.currentExpense = null;
        }
        state.successMessage = 'Expense removed successfully!';
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const {
  setCurrentExpense,
  clearCurrentExpense,
  clearExpenseMessages,
} = expenseSlice.actions;

export default expenseSlice.reducer;
