const mongoose = require('mongoose');

/**
 * Expense Schema
 * Represents an individual expense item created by a user.
 * Linked to the User model via ObjectId reference.
 */
const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // Speeds up queries filtering expenses by user
    },
    title: {
      type: String,
      required: [true, 'Please provide an expense title'],
      trim: true,
      maxlength: [100, 'Expense title cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an expense amount'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    category: {
      type: String,
      required: [true, 'Please select an expense category'],
      enum: {
        values: ['Food', 'Travel', 'Shopping', 'Bills', 'Education', 'Other'],
        message: '{VALUE} is not a valid expense category',
      },
      default: 'Other',
    },
    date: {
      type: Date,
      required: [true, 'Please provide an expense date'],
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Expense', expenseSchema);
