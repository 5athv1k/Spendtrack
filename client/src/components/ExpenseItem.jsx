import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  deleteExpense,
  setCurrentExpense,
} from '../features/expenses/expenseSlice';

/**
 * Category styling map for colorful badges
 */
const CATEGORY_COLORS = {
  Food: { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  Travel: { bg: '#E0F2FE', color: '#0284C7', border: '#BAE6FD' },
  Shopping: { bg: '#F3E8FF', color: '#9333EA', border: '#E9D5FF' },
  Bills: { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
  Education: { bg: '#DCFCE7', color: '#16A34A', border: '#BBF7D0' },
  Other: { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' },
};

/**
 * ExpenseItem Component
 * Renders an individual expense row/card with actions to Edit or Delete.
 * Includes a built-in delete confirmation dialog to prevent accidental deletion.
 */
const ExpenseItem = ({ expense, isEditing }) => {
  const dispatch = useDispatch();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const { _id, title, amount, category, date, notes } = expense;

  const categoryStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;

  // Format date nicely (e.g. "Nov 15, 2026")
  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Format currency in Indian Rupees
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);

  const handleEdit = () => {
    dispatch(setCurrentExpense(expense));
    // Smoothly scroll to the form card on mobile/smaller screens
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = () => {
    dispatch(deleteExpense(_id));
    setShowConfirmDelete(false);
  };

  return (
    <div className={`expense-item ${isEditing ? 'expense-item-active' : ''}`}>
      <div className="expense-item-main">
        <div className="expense-item-header">
          <span
            className="category-pill"
            style={{
              backgroundColor: categoryStyle.bg,
              color: categoryStyle.color,
              borderColor: categoryStyle.border,
            }}
          >
            {category}
          </span>
          <span className="expense-date">{formattedDate}</span>
        </div>

        <h4 className="expense-title">{title}</h4>

        {notes && (
          <p className="expense-notes" title={notes}>
            {notes}
          </p>
        )}
      </div>

      <div className="expense-item-side">
        <div className="expense-amount-wrapper">
          <span className="expense-amount">{formattedAmount}</span>
        </div>

        <div className="expense-actions">
          {showConfirmDelete ? (
            <div className="delete-confirm-box">
              <span className="delete-confirm-text">Confirm delete?</span>
              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-danger btn-xs"
                title="Confirm Delete"
              >
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="btn btn-secondary btn-xs"
                title="Cancel"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="action-buttons-group">
              <button
                type="button"
                onClick={handleEdit}
                className={`btn btn-sm ${isEditing ? 'btn-warning' : 'btn-outline-primary'}`}
                title="Edit this expense"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ marginRight: '4px' }}
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                {isEditing ? 'Editing' : 'Edit'}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="btn btn-outline-danger btn-sm"
                title="Delete this expense"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ marginRight: '4px' }}
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem;
