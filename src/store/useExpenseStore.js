import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useExpenseStore = create(
    persist(
        (set) => ({
            expenses: [],
            addExpense: (expense) =>
                set((state) => ({
                    expenses: [
                        { id: crypto.randomUUID(), ...expense },
                        ...state.expenses,
                    ],
                })),
            removeExpense: (id) =>
                set((state) => ({
                    expenses: state.expenses.filter((e) => e.id !== id),
                })),
        }),
        {
            name: 'expense-storage', // unique name for localStorage
        }
    )
);

export default useExpenseStore;
