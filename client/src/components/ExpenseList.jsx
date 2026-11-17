import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses } from '../features/expenses/expenseSlice';
import ExpenseItem from './ExpenseItem';

const CATEGORIES = ['All', 'Food', 'Travel', 'Shopping', 'Bills', 'Education', 'Other'];

/**
 * ExpenseList Component
 * Provides real-time filtering, search input, and renders all expense items.
 */
const ExpenseList = () => {
  const dispatch = useDispatch();
  const { expenses, currentExpense, isLoading, isError, errorMessage } = useSelector(
    (state) => state.expenses
  );

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch expenses whenever category or search criteria changes (debounced search)
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        fetchExpenses({
          category: selectedCategory,
          search: searchTerm,
        })
      );
    }, 250); // Small debounce for responsive typing

    return () => clearTimeout(timer);
  }, [dispatch, selectedCategory, searchTerm]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchTerm('');
  };

  return (
    <div className="card expense-list-card">
      <div className="expense-list-header">
        <div className="list-title-area">
          <h3>Recent Transactions</h3>
          <span className="badge badge-primary">
            {expenses.length} {expenses.length === 1 ? 'record' : 'records'}
          </span>
        </div>

        {/* Search and Category Filters */}
        <div className="filter-controls">
          <div className="search-box">
            <svg
              className="search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search expenses by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control search-input"
            />
            {searchTerm && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchTerm('')}
                title="Clear search"
              >
                &times;
              </button>
            )}
          </div>

          <div className="category-filter">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-control category-select"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error notification if fetch fails */}
      {isError && (
        <div className="alert alert-danger" role="alert">
          {errorMessage || 'Failed to load expenses. Please check your connection.'}
        </div>
      )}

      {/* Expense Items List */}
      <div className="expense-items-container">
        {isLoading && expenses.length === 0 ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your expenses...</p>
          </div>
        ) : expenses.length > 0 ? (
          <div className="expense-items-list">
            {expenses.map((expense) => (
              <ExpenseItem
                key={expense._id}
                expense={expense}
                isEditing={currentExpense?._id === expense._id}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <h4>No expenses found</h4>
            <p>
              {searchTerm || selectedCategory !== 'All'
                ? 'No transactions match your current search or category filter.'
                : 'You have not added any expenses yet. Fill out the form to add your first expense!'}
            </p>
            {(searchTerm || selectedCategory !== 'All') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-outline-primary btn-sm mt-3"
              >
                Reset All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
