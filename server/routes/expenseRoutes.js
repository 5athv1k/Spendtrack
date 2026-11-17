const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

// Valid categories list
const validCategories = ['Food', 'Travel', 'Shopping', 'Bills', 'Education', 'Other'];

/**
 * Validation rules for creating/updating an expense
 */
const expenseValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Expense title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a number greater than 0'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(validCategories)
    .withMessage(`Category must be one of: ${validCategories.join(', ')}`),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid date format (YYYY-MM-DD)'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
];

// All expense routes require a valid JWT token
router.use(protect);

// Route mappings
router.route('/')
  .get(getExpenses)
  .post(expenseValidation, createExpense);

router.route('/:id')
  .get(getExpenseById)
  .put(expenseValidation, updateExpense)
  .delete(deleteExpense);

module.exports = router;
