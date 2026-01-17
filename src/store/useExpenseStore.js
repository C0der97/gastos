import { create } from 'zustand';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, getDocs, doc } from 'firebase/firestore';
import { deleteImage } from '../utils/storage';

const useExpenseStore = create((set, get) => ({
    expenses: [],
    loading: false,

    fetchExpenses: async () => {
        set({ loading: true });
        try {
            const querySnapshot = await getDocs(collection(db, 'expenses'));
            const loadedExpenses = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            set({ expenses: loadedExpenses, loading: false });
        } catch (error) {
            console.error("Error fetching expenses:", error);
            set({ loading: false });
        }
    },

    addExpense: async (expense) => {
        try {
            const docRef = await addDoc(collection(db, 'expenses'), expense);
            const newExpense = { id: docRef.id, ...expense };
            set((state) => ({
                expenses: [newExpense, ...state.expenses],
            }));
        } catch (error) {
            console.error("Error adding expense:", error);
        }
    },

    removeExpense: async (id) => {
        try {
            const expense = get().expenses.find((e) => e.id === id);

            // 1. Delete from Firestore Data
            await deleteDoc(doc(db, 'expenses', id));

            // 2. Delete Image (if exists) from Firestore 'receipts'
            if (expense?.imageId) {
                await deleteImage(expense.imageId);
            }

            // 3. Update Local State
            set((state) => ({
                expenses: state.expenses.filter((e) => e.id !== id),
            }));
        } catch (error) {
            console.error("Error removing expense:", error);
        }
    },
}));

export default useExpenseStore;
