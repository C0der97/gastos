import React, { useState } from 'react';
import useExpenseStore from '../store/useExpenseStore';
import { format } from 'date-fns';
import { PlusCircle, Camera, X } from 'lucide-react';
import { saveImage } from '../utils/storage';
import { NumericFormat } from 'react-number-format';
import { numeroALetras } from 'numero-a-letras';

const AddExpenseForm = () => {
    const addExpense = useExpenseStore((state) => state.addExpense);

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const clearImage = () => {
        setImageFile(null);
        setPreviewUrl(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || !description) return;

        let imageId = null;
        if (imageFile) {
            imageId = await saveImage(imageFile);
        }

        addExpense({
            amount: parseFloat(amount),
            description,
            date, // store as YYYY-MM-DD string
            imageId,
        });

        // Reset form
        setAmount('');
        setDescription('');
        setDate(format(new Date(), 'yyyy-MM-dd'));
        clearImage();
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Valor</label>
                <NumericFormat
                    value={amount}
                    onValueChange={(values) => setAmount(values.value)}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="$ "
                    placeholder="$ 0"
                    className="w-full text-3xl font-bold p-3 border-b-2 border-gray-200 focus:border-blue-500 outline-none transition-colors placeholder-gray-300"
                    inputMode="decimal"
                    required
                />
                {amount && (
                    <p className="text-gray-500 text-sm mt-1 uppercase font-medium">
                        {numeroALetras(parseFloat(amount), {
                            plural: 'PESOS',
                            singular: 'PESO',
                            centPlural: 'CENTAVOS',
                            centSingular: 'CENTAVO'
                        })}
                    </p>
                )}
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

            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Foto / Recibo (Opcional)</label>
                {!previewUrl ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Camera className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Toca para agregar foto</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                ) : (
                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                        <button
                            type="button"
                            onClick={clearImage}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}
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
