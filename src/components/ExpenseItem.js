import React, { useCallback } from 'react';

const CATEGORY_ICONS = {
  food: '🍔',
  transport: '🚗',
  shopping: '🛍️',
  health: '💊',
  entertainment: '🎮',
  utilities: '⚡',
  income: '💰',
  other: '📦',
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
};

const ExpenseItem = ({ expense, onDelete }) => {
  const isIncome = expense.type === 'income';
  const icon = CATEGORY_ICONS[expense.category] || '📦';

  const handleDelete = useCallback(() => {
    onDelete(expense.id);
  }, [onDelete, expense.id]);

  return (
    <li className="expense-item">
      <div className={`expense-icon cat-${expense.category}`}>
        {icon}
      </div>

      <div className="expense-details">
        <div className="expense-name" title={expense.name}>{expense.name}</div>
        <div className="expense-meta">
          <span className="expense-category">{expense.category}</span>
          <span className="expense-dot" />
          <span className="expense-date">{formatDate(expense.date)}</span>
        </div>
      </div>

      <span className={`expense-amount ${isIncome ? 'positive' : 'negative'}`}>
        {isIncome ? '+' : '−'}₹{formatAmount(expense.amount)}
      </span>

      <button
        className="btn-delete"
        onClick={handleDelete}
        aria-label={`Delete ${expense.name}`}
        title="Delete"
      >
        ✕
      </button>
    </li>
  );
};

export default React.memo(ExpenseItem);