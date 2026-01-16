import React from 'react';
import useExpenseStore from '../store/useExpenseStore';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';

const SummaryCard = () => {
    const expenses = useExpenseStore((state) => state.expenses);

    // Calculate total for current month
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const currentMonthTotal = expenses
        .filter((expense) => {
            const expenseDate = parseISO(expense.date);
            return isWithinInterval(expenseDate, { start, end });
        })
        .reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);

    const monthName = format(now, 'MMMM', { locale: es });

    return (
        <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg mb-6">
            <h2 className="text-xl opacity-90 capitalize">Gastos de {monthName}</h2>
            <p className="text-5xl font-bold mt-2">
                ${currentMonthTotal.toLocaleString('es-CO')}
            </p>
        </div>
    );
};

export default SummaryCard;
