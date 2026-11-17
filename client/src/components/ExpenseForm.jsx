import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addExpense,
  updateExpense,
  clearCurrentExpense,
} from '../features/expenses/expenseSlice';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Education', 'Other'];

// Helper to format Date to YYYY-MM-DD for standard date input
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * ExpenseForm Component
 * Handles both Adding a new expense and Editing an existing expense.
 * Automatically synchronizes with `currentExpense` from Redux state.
 */
const ExpenseForm = () => {
  const dispatch = useDispatch();
  const { currentExpense, isLoading } = useSelector((state) => state.expenses);

  const initialFormState = {
    title: '',
    amount: '',
    category: 'Food',
    date: getTodayDateString(),
    notes: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState('');

  // When currentExpense changes (user clicked Edit on an item), pre-fill the form
  useEffect(() => {
    if (currentExpense) {
      const formattedDate = currentExpense.date
        ? new Date(currentExpense.date).toISOString().split('T')[0]
        : getTodayDateString();

      setFormData({
        title: currentExpense.title || '',
        amount: currentExpense.amount || '',
        category: currentExpense.category || 'Food',
        date: formattedDate,
        notes: currentExpense.notes || '',
      });
      setFormError('');
    } else {
      setFormData(initialFormState);
    }
  }, [currentExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formError) setFormError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validations
    if (!formData.title.trim()) {
      setFormError('Please enter an expense title.');
      return;
    }

    const numAmount = parseFloat(formData.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setFormError('Please enter a valid amount greater than ₹0.');
      return;
    }

    if (!formData.category) {
      setFormError('Please select a category.');
      return;
    }

    if (!formData.date) {
      setFormError('Please select a valid date.');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      amount: numAmount,
      category: formData.category,
      date: formData.date,
      notes: formData.notes.trim(),
    };

    if (currentExpense) {
      // Dispatch Update
      dispatch(updateExpense({ id: currentExpense._id, expenseData: payload }))
        .unwrap()
        .then(() => {
          setFormData(initialFormState);
          setFormError('');
        })
        .catch((err) => {
          setFormError(err || 'Failed to update expense.');
        });
    } else {
      // Dispatch Create
      dispatch(addExpense(payload))
        .unwrap()
        .then(() => {
          setFormData(initialFormState);
          setFormError('');
        })
        .catch((err) => {
          setFormError(err || 'Failed to create expense.');
        });
    }
  };

  const handleCancelEdit = () => {
    dispatch(clearCurrentExpense());
    setFormData(initialFormState);
    setFormError('');
  };

  return (
    <div className={`card form-card ${currentExpense ? 'is-editing' : ''}`}>
      <div className="card-header">
        <div className="card-header-title">
          <span className="card-icon">
            {currentExpense ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            )}
          </span>
          <h3>{currentExpense ? 'Edit Expense' : 'Add New Expense'}</h3>
        </div>
        {currentExpense && (
          <span className="badge badge-warning">Editing Mode</span>
        )}
      </div>

      {formError && (
        <div className="alert alert-danger" role="alert">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="expense-form" noValidate>
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title / Description <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="e.g. Metro Pass, Groceries, Books"
            value={formData.title}
            onChange={handleChange}
            className="form-control"
            required
            maxLength={100}
          />
        </div>

        <div className="form-row">
          <div className="form-group col-half">
            <label htmlFor="amount" className="form-label">
              Amount (₹) <span className="text-danger">*</span>
            </label>
            <div className="input-prefix-wrapper">
              <span className="input-prefix">₹</span>
              <input
                type="number"
                id="amount"
                name="amount"
                placeholder="0.00"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={handleChange}
                className="form-control input-with-prefix"
                required
              />
            </div>
          </div>

          <div className="form-group col-half">
            <label htmlFor="category" className="form-label">
              Category <span className="text-danger">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-control"
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="date" className="form-label">
            Date <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes" className="form-label">
            Notes / Remarks <span className="text-muted">(Optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="2"
            placeholder="Additional details about this transaction..."
            value={formData.notes}
            onChange={handleChange}
            className="form-control"
            maxLength={500}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className={`btn ${currentExpense ? 'btn-success' : 'btn-primary'} btn-block`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner-sm"></span>
            ) : currentExpense ? (
              'Save Changes'
            ) : (
              '+ Add Expense'
            )}
          </button>

          {currentExpense && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="btn btn-outline-secondary btn-block"
              disabled={isLoading}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
