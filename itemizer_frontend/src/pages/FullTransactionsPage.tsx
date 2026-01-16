import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import FilterSidebar from '../components/FilterSidebar';
import TransactionDetails from '../components/TransactionDetails';
import { ArrowLeft, Download } from 'lucide-react';
import type {Transaction} from "../types.ts";
import CategoryModal from "../components/CategoryModal.tsx";

const FullTransactionsPage: React.FC = () => {
    const navigate = useNavigate();
    const { filteredTransactions, transactions, filters, updateTransactionCategory,  } = useTransactions();
    const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);



    // Get categories for the sidebar
    const categories = React.useMemo(() => {
        return ['All', ...new Set(transactions.map(tx => tx.primaryCategory))];
    }, [transactions]);

    // Simple CSV Export Function
    const exportToCSV = () => {
        const headers = ["Date,Merchant,Category,Detailed Category,Amount\n"];
        const rows = filteredTransactions.map(tx =>
            `${tx.date},${tx.merchant},${tx.primaryCategory},${tx.detailedCategory},${tx.amount}`
        );
        const blob = new Blob([headers + rows.join("\n")], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `transactions_${new Date().toISOString().slice(0,10)}.csv`);
        a.click();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">All Transactions</h1>
                            <p className="text-gray-500 font-medium">History & Detailed Analysis</p>
                        </div>
                    </div>

                    <button
                        onClick={exportToCSV}
                        className="flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-sm"
                    >
                        <Download size={18} />
                        Export CSV
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar: Reusing our component */}
                    <div className="lg:col-span-1">
                        <FilterSidebar filters={filters} categories={categories} />
                    </div>

                    {/* Full Table View */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Merchant</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Detailed</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                    {filteredTransactions.map((tx) => (
                                        <tr
                                            key={tx.id}
                                            onClick={() => setViewingTransaction(tx)}
                                            className="hover:bg-blue-50/30 cursor-pointer transition-colors group"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                                {new Date(tx.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-400 group-hover:bg-white transition-colors">
                                                        {tx.merchant[0]}
                                                    </div>
                                                    <span className="font-bold text-gray-800">{tx.merchant}</span>
                                                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">
            💳 {tx.accountName} (***{tx.accountMask})
        </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                                                        {tx.primaryCategory}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400">
                                                {tx.detailedCategory}
                                            </td>
                                            <td className={`px-6 py-4 text-right font-black ${tx.amount > 0 ? 'text-gray-900' : 'text-green-600'}`}>
                                                {tx.amount > 0 ? `-$${tx.amount.toFixed(2)}` : `+$${Math.abs(tx.amount).toFixed(2)}`}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredTransactions.length === 0 && (
                                <div className="p-12 text-center">
                                    <p className="text-gray-400 font-medium">No transactions found for these filters.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <TransactionDetails
                transaction={viewingTransaction}
                onClose={() => setViewingTransaction(null)}
                onEditCategory = {(tx) => setEditingTransaction(tx)}
            />

            <CategoryModal
                transaction = {editingTransaction}
                onClose = {() => setEditingTransaction(null)}
                onSave = { (id, newCat) => {
                    updateTransactionCategory(id, newCat);
                    setEditingTransaction(null);
                }}
            />
        </div>
    );
};

export default FullTransactionsPage;