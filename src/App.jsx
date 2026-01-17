import React, { useEffect, useState } from 'react';
import useExpenseStore from './store/useExpenseStore';
import AddExpenseForm from './components/AddExpenseForm';
import ExpenseList from './components/ExpenseList';
import SummaryCard from './components/SummaryCard';
import Dashboard from './components/Dashboard';
import { Wallet, LayoutDashboard, List } from 'lucide-react';

function App() {
  const fetchExpenses = useExpenseStore((state) => state.fetchExpenses);
  const [view, setView] = useState('list'); // 'list' | 'dashboard'

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <header className="flex items-center justify-between py-6 px-2">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Wallet size={28} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-800">Abuelo Gastos</h1>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 mb-6">
          <button
            onClick={() => setView('list')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${view === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            <List size={18} />
            Gastos
          </button>
          <button
            onClick={() => setView('dashboard')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${view === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            <LayoutDashboard size={18} />
            Estadísticas
          </button>
        </div>

        <main>
          {view === 'list' ? (
            <>
              <SummaryCard />
              <AddExpenseForm />
              <ExpenseList />
            </>
          ) : (
            <Dashboard />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
