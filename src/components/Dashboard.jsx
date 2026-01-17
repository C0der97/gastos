import React from 'react';
import useExpenseStore from '../store/useExpenseStore';
import { format, parseISO, startOfMonth, compareDesc } from 'date-fns';
import { es } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Dashboard = () => {
    const expenses = useExpenseStore((state) => state.expenses);

    // 1. Agrupar por Mes (YYYY-MM)
    const grouped = expenses.reduce((acc, expense) => {
        const date = parseISO(expense.date);
        const key = format(date, 'yyyy-MM');

        if (!acc[key]) {
            acc[key] = {
                monthKey: key,
                total: 0,
                dateObj: date, // Para ordenar o formatear después
                display: format(date, 'MMM', { locale: es }).toUpperCase()
            };
        }
        acc[key].total += parseFloat(expense.amount || 0);
        return acc;
    }, {});

    // 2. Convertir a Array y Ordenar (Cronológico: Enero, Febrero...)
    const data = Object.values(grouped).sort((a, b) => a.monthKey.localeCompare(b.monthKey));

    // 3. Formato de moneda para el Tooltip
    const formatCurrency = (value) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);

    // Personalizar Tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 shadow-xl rounded-lg">
                    <p className="font-bold text-gray-800 capitalize">{payload[0].payload.display}</p>
                    <p className="text-blue-600 font-bold">
                        {formatCurrency(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8">
            {/* Gráfico */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 h-80">
                <h3 className="text-lg font-bold text-gray-700 mb-4 px-2">Tendencia Mensual</h3>
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="display"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            />
                            <YAxis
                                hide
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#EFF6FF' }} />
                            <Bar
                                dataKey="total"
                                fill="#2563EB"
                                radius={[6, 6, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        No hay datos suficientes
                    </div>
                )}
            </div>

            {/* Lista Detallada */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-700 px-2">Detalle por Mes</h3>
                {data.slice().reverse().map((item) => ( // Reverse para mostrar el más reciente arriba
                    <div key={item.monthKey} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                                {format(item.dateObj, 'yyyy')}
                            </p>
                            <p className="text-xl font-bold text-gray-800 capitalize">
                                {format(item.dateObj, 'MMMM', { locale: es })}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-blue-600">
                                {formatCurrency(item.total)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
