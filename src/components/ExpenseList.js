import React from 'react';
import ExpenseItem from './ExpenseItem';

const ExpenseList = ({ expenses, loading, search, filter, onSearchChange, onFilterChange, onDelete }) => {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <span className="loading-text">Fetching transactions...</span>
      </div>
    );
  }

  return (
    <>
      <div className="list-controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search transactions"
        />
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          aria-label="Filter by type"
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expenses</option>
        </select>
      </div>

      {expenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p className="empty-title">No transactions found</p>
          <p className="empty-sub">Try adjusting your filters or add a new entry</p>
        </div>
      ) : (
        <ul className="expense-list" aria-label="Transactions list">
          {expenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </>
  );
};

export default ExpenseList;