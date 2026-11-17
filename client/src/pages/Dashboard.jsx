import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchExpenses,
  clearExpenseMessages,
} from '../features/expenses/expenseSlice';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';

/**
 * Dashboard Page Component
 * Main protected view displaying statistics overview cards, expense form, and transaction list.
 */
const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { expenses, successMessage } = useSelector((state) => state.expenses);

  // Initial fetch of user's expenses
  useEffect(() => {
    dispatch(fetchExpenses({ category: 'All', search: '' }));
  }, [dispatch]);

  // Automatically fade out success messages after 4 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearExpenseMessages());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  // Compute key expense summary metrics using useMemo for performance
  const stats = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return {
        totalSpent: 0,
        totalCount: 0,
        topCategory: 'None',
        averageExpense: 0,
      };
    }

    let sum = 0;
    const categoryTotals = {};

    expenses.forEach((item) => {
      const amt = Number(item.amount) || 0;
      sum += amt;
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + amt;
    });

    // Find highest spending category
    let maxCat = 'None';
    let maxCatAmt = -1;
    for (const [cat, total] of Object.entries(categoryTotals)) {
      if (total > maxCatAmt) {
        maxCatAmt = total;
        maxCat = cat;
      }
    }

    return {
      totalSpent: sum,
      totalCount: expenses.length,
      topCategory: maxCat,
      averageExpense: sum / expenses.length,
    };
  }, [expenses]);

  const formatINR = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);

  return (
    <div className="dashboard-container">
      {/* Welcome Header */}
      <section className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Expense Dashboard
          </h1>
          <p className="dashboard-subtitle">
            Welcome back, <strong>{user?.name || 'Student'}</strong>! Here is your spending summary.
          </p>
        </div>
      </section>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible" role="alert">
          <span>{successMessage}</span>
          <button
            type="button"
            className="alert-close-btn"
            onClick={() => dispatch(clearExpenseMessages())}
          >
            &times;
          </button>
        </div>
      )}

      {/* Summary Cards Row */}
      <section className="metrics-grid">
        <div className="metric-card metric-primary">
          <div className="metric-icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div className="metric-details">
            <span className="metric-label">Total Spent</span>
            <h2 className="metric-value">{formatINR(stats.totalSpent)}</h2>
          </div>
        </div>

        <div className="metric-card metric-info">
          <div className="metric-icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <div className="metric-details">
            <span className="metric-label">Total Transactions</span>
            <h2 className="metric-value">{stats.totalCount}</h2>
          </div>
        </div>

        <div className="metric-card metric-warning">
          <div className="metric-icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div className="metric-details">
            <span className="metric-label">Top Category</span>
            <h2 className="metric-value">{stats.topCategory}</h2>
          </div>
        </div>

        <div className="metric-card metric-success">
          <div className="metric-icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </div>
          <div className="metric-details">
            <span className="metric-label">Average Expense</span>
            <h2 className="metric-value">{formatINR(stats.averageExpense)}</h2>
          </div>
        </div>
      </section>

      {/* Main Workspace: Form & List */}
      <section className="dashboard-content-layout">
        <aside className="content-sidebar">
          <ExpenseForm />
        </aside>
        <main className="content-main">
          <ExpenseList />
        </main>
      </section>
    </div>
  );
};

export default Dashboard;
