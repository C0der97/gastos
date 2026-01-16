import React from 'react';
import AddExpenseForm from './components/AddExpenseForm';
import ExpenseList from './components/ExpenseList';
import SummaryCard from './components/SummaryCard';
import { Wallet } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <header className="flex items-center gap-3 py-6 px-2">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <Wallet size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">Abuelo Gastos</h1>
        </header>

        <main>
          <SummaryCard />
          <AddExpenseForm />
          <ExpenseList />
        </main>
      </div>
    </div>
  );
}

export default App;
