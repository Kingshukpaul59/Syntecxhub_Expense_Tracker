import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import './styles.css';
import ExpenseForm from './components/ExpenseFrom';
import ExpenseList from './components/ExpenseList';

// ── Helpers ──────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split('T')[0];

const INITIAL_FORM = {
  name: '',
  amount: '',
  date: today(),
  category: 'food',
  type: 'expense',
};

// Realistic Indian expense names per category
const INDIAN_NAMES = {
  food: [
    'Lunch at canteen',
    'Dinner with friends',
    'Street food – chaat',
    'Breakfast at dhaba',
    'Swiggy order – biryani',
    'Zomato order – pizza',
    'Evening snacks',
    'Chai & samosa',
    'Office tiffin',
    'Sunday family lunch',
    'Paneer roll from stall',
    'Dominos order',
  ],
  transport: [
    'Auto fare to market',
    'Bus ticket – daily pass',
    'Petrol fill-up',
    'Ola cab to office',
    'Rapido bike ride',
    'Metro card recharge',
    'Train ticket – local',
    'Uber airport drop',
    'Auto to railway station',
    'Monthly bus pass',
    'Rickshaw fare',
    'Cab sharing – office',
  ],
  shopping: [
    'Grocery shopping – DMart',
    'Flipkart order – headphones',
    'Clothes purchase – Myntra',
    'Amazon order – books',
    'Vegetable shopping',
    'Meesho kurta order',
    'Stationery purchase',
    'Monthly grocery – BigBasket',
    'Shoes from Bata',
    'Notebook & pen set',
    'Mobile cover – Snapdeal',
    'Festive shopping',
  ],
  health: [
    'Medicine from medical store',
    'Doctor consultation fee',
    'Apollo pharmacy bill',
    'Blood test – lab fee',
    'Vitamin supplements',
    'Eye checkup',
    'Dental visit',
    'Gym membership fee',
    'Protein powder',
    'Physiotherapy session',
    'OPD charges – hospital',
    'Medicine refill',
  ],
  entertainment: [
    'Movie ticket – PVR',
    'Netflix subscription',
    'Amazon Prime recharge',
    'Gaming recharge – BGMI',
    'IPL match ticket',
    'Spotify premium',
    'Weekend outing',
    'Bowling with friends',
    'Zoo entry ticket',
    'Hotstar subscription',
    'Concert ticket',
    'Amusement park entry',
  ],
  utilities: [
    'Electricity bill – BESCOM',
    'Mobile recharge – Jio',
    'Internet bill – ACT',
    'Water bill',
    'Gas cylinder refill',
    'DTH recharge – Tata Play',
    'Airtel postpaid bill',
    'Society maintenance fee',
    'BSNL broadband bill',
    'Cooking gas top-up',
    'LED bulb replacement',
    'Wi-Fi router bill',
  ],
};

const INCOME_NAMES = [
  'Monthly salary credited',
  'Freelance project payment',
  'UPI transfer received',
  'Pocket money from family',
  'Part-time job earnings',
  'Refund from Amazon',
  'Festival bonus',
  'Cash gift – birthday',
];

// Map JSONPlaceholder post → mock expense with Indian names
const mapApiToExpense = (post, index) => {
  const categories = ['food', 'transport', 'shopping', 'health', 'entertainment', 'utilities'];
  const types = ['expense', 'expense', 'expense', 'income'];
  const cat = categories[index % categories.length];
  const type = types[index % types.length];
  const d = new Date();
  d.setDate(d.getDate() - index);

  const nameList = type === 'income' ? INCOME_NAMES : INDIAN_NAMES[cat];
  const name = nameList[index % nameList.length];

  // Realistic amounts per category
  const amountRanges = {
    food:          [60,  500],
    transport:     [20,  400],
    shopping:      [200, 3000],
    health:        [100, 1500],
    entertainment: [150, 1200],
    utilities:     [200, 2000],
  };
  const [min, max] = type === 'income' ? [8000, 50000] : amountRanges[cat];
  const amount = parseFloat((Math.random() * (max - min) + min).toFixed(2));

  return {
    id: `api-${post.id}`,
    name,
    amount,
    date: d.toISOString().split('T')[0],
    category: type === 'income' ? 'income' : cat,
    type,
    source: 'api',
  };
};

// ── App ───────────────────────────────────────────────────────────────
export default function App() {
  // ── useState: form + expense list + UI state ──────────────────────
  const [expenses, setExpenses]   = useState([]);
  const [form, setForm]           = useState(INITIAL_FORM);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('all');
  const [toast, setToast]         = useState(null);

  // ── useRef: abort controller to cancel stale fetches ─────────────
  const abortRef = useRef(null);
  const toastTimer = useRef(null);

  // ── useEffect: fetch mock data from JSONPlaceholder on mount ──────
  useEffect(() => {
    abortRef.current = new AbortController();

    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          'https://jsonplaceholder.typicode.com/posts?_limit=12',
          { signal: abortRef.current.signal }
        );
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        const mapped = data.map(mapApiToExpense);
        setExpenses(mapped);
      } catch (err) {
        if (err.name !== 'AbortError') {
          showToast('Failed to load initial data', 'error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();

    // Cleanup: abort pending fetch if component unmounts
    return () => abortRef.current?.abort();
  }, []);

  // ── useEffect: persist expenses to localStorage ───────────────────
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [expenses, loading]);

  // ── useMemo: derived stats (expensive recalculation guarded) ──────
  const stats = useMemo(() => {
    const totalIncome = expenses
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalExpenses = expenses
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      balance: totalIncome - totalExpenses,
      income: totalIncome,
      expenses: totalExpenses,
      count: expenses.length,
    };
  }, [expenses]);

  // ── useMemo: filtered + searched expense list ─────────────────────
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || e.type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [expenses, search, filter]);

  // ── useCallback: stable handlers (won't re-create on every render) ─
  const handleFormChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    const { name, amount, date, category, type } = form;
    if (!name.trim()) { showToast('Please enter a description', 'error'); return false; }
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      showToast('Please enter a valid amount', 'error');
      return false;
    }
    if (!date) { showToast('Please pick a date', 'error'); return false; }

    const newExpense = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      amount: parseFloat(parseFloat(amount).toFixed(2)),
      date,
      category,
      type,
      source: 'user',
    };

    setExpenses((prev) => [newExpense, ...prev]);
    setForm({ ...INITIAL_FORM, date: today() });
    showToast(`Transaction added!`, 'success');
    return true;
  }, [form]);

  const handleDelete = useCallback((id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast('Transaction removed', 'success');
  }, []);

  const handleSearchChange = useCallback((val) => setSearch(val), []);
  const handleFilterChange = useCallback((val) => setFilter(val), []);

  // ── Toast helper ─────────────────────────────────────────────────
  const showToast = (message, type = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  // ── Format currency ──────────────────────────────────────────────
  const fmt = (n) =>
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.abs(n));

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <span className="header-badge">Personal Finance</span>
          <h1 className="header-title">ExpenseTrack</h1>
          <p className="header-date">{currentDate}</p>
        </div>
      </header>

      {/* Stats Row */}
      <div className="stats-row" role="region" aria-label="Financial summary">
        <div className="stat-card total">
          <p className="stat-label">Net Balance</p>
          <p className="stat-value" style={{ color: stats.balance >= 0 ? 'var(--green)' : 'var(--red)' }}>
            {stats.balance >= 0 ? '+' : '−'}₹{fmt(stats.balance)}
          </p>
          <p className="stat-count">{stats.count} transactions</p>
        </div>
        <div className="stat-card income">
          <p className="stat-label">Total Income</p>
          <p className="stat-value">+₹{fmt(stats.income)}</p>
          <p className="stat-count">{expenses.filter(e => e.type === 'income').length} entries</p>
        </div>
        <div className="stat-card expenses-stat">
          <p className="stat-label">Total Expenses</p>
          <p className="stat-value">−₹{fmt(stats.expenses)}</p>
          <p className="stat-count">{expenses.filter(e => e.type === 'expense').length} entries</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="main-grid">
        {/* Form Panel */}
        <section className="section" aria-label="Add new transaction">
          <div className="section-header">
            <span className="section-title">New Transaction</span>
          </div>
          <ExpenseForm
            form={form}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
          />
        </section>

        {/* List Panel */}
        <section className="section" aria-label="Transaction history">
          <div className="section-header">
            <span className="section-title">Transactions</span>
            {filteredExpenses.length > 0 && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                {filteredExpenses.length} shown
              </span>
            )}
          </div>
          <ExpenseList
            expenses={filteredExpenses}
            loading={loading}
            search={search}
            filter={filter}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            onDelete={handleDelete}
          />
        </section>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast ${toast.type}`} role="alert" aria-live="polite">
          <span>{toast.type === 'success' ? '✓' : '⚠'}</span>
          {toast.message}
        </div>
      )}
    </div>
  );
}