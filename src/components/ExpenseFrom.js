import React, { useRef, useCallback } from 'react';

const CATEGORIES = [
  { value: 'food', label: '🍔 Food & Dining' },
  { value: 'transport', label: '🚗 Transport' },
  { value: 'shopping', label: '🛍️ Shopping' },
  { value: 'health', label: '💊 Health' },
  { value: 'entertainment', label: '🎮 Entertainment' },
  { value: 'utilities', label: '⚡ Utilities' },
  { value: 'income', label: '💰 Income' },
  { value: 'other', label: '📦 Other' },
];

const ExpenseForm = ({ form, onChange, onSubmit }) => {
  // useRef: focus management for first field on mount and after submit
  const nameRef = useRef(null);
  const amountRef = useRef(null);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const success = onSubmit();
    if (success && nameRef.current) {
      nameRef.current.focus();
    }
  }, [onSubmit]);

  const handleAmountKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      amountRef.current?.blur();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  return (
    <form className="expense-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label className="form-label" htmlFor="expense-name">Description</label>
        <input
          id="expense-name"
          ref={nameRef}
          type="text"
          className="form-input"
          placeholder="e.g. Lunch at cafe..."
          value={form.name}
          onChange={(e) => onChange('name', e.target.value)}
          autoFocus
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="expense-amount">Amount (₹)</label>
          <input
            id="expense-amount"
            ref={amountRef}
            type="number"
            className="form-input"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => onChange('amount', e.target.value)}
            onKeyDown={handleAmountKeyDown}
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="expense-date">Date</label>
          <input
            id="expense-date"
            type="date"
            className="form-input"
            value={form.date}
            onChange={(e) => onChange('date', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="expense-category">Category</label>
          <select
            id="expense-category"
            className="form-select"
            value={form.category}
            onChange={(e) => onChange('category', e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="expense-type">Type</label>
          <select
            id="expense-type"
            className="form-select"
            value={form.type}
            onChange={(e) => onChange('type', e.target.value)}
          >
            <option value="expense">— Expense</option>
            <option value="income">+ Income</option>
          </select>
        </div>
      </div>

      <button type="submit" className="btn-submit">
        + Add Transaction
      </button>
    </form>
  );
};

export default ExpenseForm;