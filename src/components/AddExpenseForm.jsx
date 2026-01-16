import React, { useState } from 'react';
import useExpenseStore from '../store/useExpenseStore';
import { format } from 'date-fns';
import { PlusCircle } from 'lucide-react';

const AddExpenseForm = () => {
    const addExpense = useExpenseStore((state) => state.addExpense);

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !description) return;

        addExpense({
            amount: parseFloat(amount),
            description,
            date, // store as YYYY-MM-DD string
        });

        // Reset form (keep date as today or last used? usually today is better)
        setAmount('');
        setDescription('');
        setDate(format(new Date(), 'yyyy-MM-dd'));
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Valor</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full text-3xl font-bold p-3 border-b-2 border-gray-200 focus:border-blue-500 outline-none transition-colors placeholder-gray-300"
                    inputMode="decimal"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej: Medicamentos"
                    className="w-full text-lg p-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                />
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Fecha</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-lg p-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 text-lg"
            >
                <PlusCircle size={24} />
                Agregar Gasto
            </button>
        </form>
    );
};

export default AddExpenseForm;
