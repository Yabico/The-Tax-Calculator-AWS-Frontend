// src/components/SpendingOverview.tsx
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { Transaction } from '../types';
import { calculateCategoryTotals } from '../utils';

// Shared colors for Chart and Legend
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6366F1', '#EC4899'];

interface SpendingOverviewProps {
    transactions: Transaction[];
}

const SpendingOverview: React.FC<SpendingOverviewProps> = ({ transactions }) => {
    const data = useMemo(() => calculateCategoryTotals(transactions), [transactions]);
    const totalSpending = data.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Spending Breakdown</h2>

            <div className="h-64 w-full relative">

                {/* 1. The Donut Chart (No Legend inside!) */}
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number | string | undefined) => {
                                if (typeof value === 'number') {
                                    return `$${value.toFixed(2)}`;
                                }
                                return `$0.00`;
                            }}
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                padding: '8px 12px'
                            }}
                            itemStyle={{ color: '#1f2937', fontWeight: 600 }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                        Total
                    </span>
                    <span className="text-2xl font-extrabold text-gray-800 mt-1">
                        ${totalSpending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
                {data.map((entry, index) => (
                    <div key={entry.name} className="flex items-center space-x-2">
                        <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-gray-700 truncate">
                                {entry.name}
                            </span>
                            <span className="text-xs text-gray-400">
                                {((entry.value / totalSpending) * 100).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpendingOverview;