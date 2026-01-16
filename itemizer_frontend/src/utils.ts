// src/utils.ts
import type { Transaction } from './types';

export interface ChartData {
    name: string;
    value: number;
}

export const calculateCategoryTotals = (transactions: Transaction[]): ChartData[] => {
    const totals: { [key: string]: number } = {};

    transactions.forEach((tx) => {
        // 1. Exclude Income (we only want to track spending)
        if (tx.is_income) return;

        // 2. Sum up amounts
        if (totals[tx.primaryCategory]) {
            totals[tx.primaryCategory] += tx.amount;
        } else {
            totals[tx.primaryCategory] = tx.amount;
        }
    });

    // 3. Convert to array format for Recharts
    return Object.keys(totals).map((category) => ({
        name: category,
        value: parseFloat(totals[category].toFixed(2)), // Fix floating point math
    }));
};

export interface ChartData {
    name: string;
    value: number;
    [key: string]: any; // <--- Add this line!
    // This tells TS that the object can have other string keys,
    // which satisfies the Recharts 'data' prop requirements.
}