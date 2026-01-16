import React from 'react';
import useExpenseStore from '../store/useExpenseStore';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';

const ExpenseList = () => {
    const { expenses, removeExpense } = useExpenseStore();

    // Sort by date desc
    const sortedExpenses = [...expenses].sort((a, b) =>
        new Date(b.date) - new Date(a.date)
    );

    // Group by Month (YYYY-MM)
    const grouped = sortedExpenses.reduce((acc, expense) => {
        const key = expense.date.substring(0, 7); // "2024-01"
        if (!acc[key]) acc[key] = [];
        acc[key].push(expense);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {Object.keys(grouped).sort().reverse().map((monthKey) => {
                const [year, month] = monthKey.split('-');
                const dateObj = new Date(parseInt(year), parseInt(month) - 1);
                const monthTitle = format(dateObj, 'MMMM yyyy', { locale: es });

                return (
                    <div key={monthKey}>
                        <h3 className="text-gray-500 font-bold mb-3 px-2 sticky top-0 bg-gray-50 py-2 capitalize">
                            {monthTitle}
                        </h3>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {grouped[monthKey].map((expense) => (
                                <div
                                    key={expense.id}
                                    className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-800 text-lg">{expense.description}</span>
                                        <span className="text-gray-400 text-sm">
                                            {format(parseISO(expense.date), 'dd MMM', { locale: es })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-gray-900 text-lg">
                                            ${expense.amount.toLocaleString('es-CO')}
                                        </span>
                                        <button
                                            onClick={() => removeExpense(expense.id)}
                                            className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                                            aria-label="Eliminar"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            {expenses.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                    <p>No hay gastos registrados aún.</p>
                </div>
            )}
        </div>
    );
};

export default ExpenseList;
