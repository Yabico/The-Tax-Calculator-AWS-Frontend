import React from 'react';
import type { Transaction } from '../types';

interface TransactionDetailsProps {
    transaction: Transaction | null;
    onClose: () => void;
    onEditCategory: (tx: Transaction) => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
                                                                   transaction,
                                                                   onClose,
                                                                   onEditCategory
                                                               }) => {
    if (!transaction) return null;

    return (
        <>
            {/* 1. Backdrop Overlay */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
                onClick={onClose}
            />

            {/* 2. Side Panel */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header with Close Button */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Transaction Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    {/* Main Stats */}
                    <div className="text-center mb-10">
                        <div className={`w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center text-3xl font-bold
              ${transaction.is_income ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                            {transaction.logo_initial}
                        </div>
                        <h3 className="text-2xl font-extrabold text-gray-900">{transaction.merchant}</h3>
                        <p className="text-gray-500 font-medium">{transaction.date}</p>
                        <div className={`text-4xl font-black mt-4 ${transaction.is_income ? 'text-green-600' : 'text-gray-900'}`}>
                            {transaction.is_income ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </div>
                    </div>

                    {/* Details List */}
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Info</h4>
                            <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                                <DetailRow
                                    label="Category"
                                    value={transaction.primaryCategory}
                                    isAction
                                    onClick={() => onEditCategory(transaction)}
                                />
                                <DetailRow label="Account" value={transaction.account_name || "Primary Checking"} />
                                <DetailRow label="Status" value={transaction.status} capitalize />
                                <DetailRow label="Method" value={transaction.payment_channel || "In Store"} capitalize />
                            </div>
                        </div>

                        {transaction.location && (
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Location</h4>
                                <div className="flex items-start gap-3 text-gray-700">
                                    <span className="text-xl text-gray-400">📍</span>
                                    <p className="font-medium">{transaction.location}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg"
                    >
                        Mark as Reviewed
                    </button>
                </div>
            </div>
        </>
    );
};

// Internal helper for clean detail rows
const DetailRow = ({ label, value, isAction, onClick, capitalize }: any) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500 font-medium">{label}</span>
        {isAction ? (
            <button
                onClick={onClick}
                className="text-blue-600 font-bold hover:underline bg-blue-50 px-3 py-1 rounded-lg"
            >
                {value}
            </button>
        ) : (
            <span className={`font-semibold text-gray-800 ${capitalize ? 'capitalize' : ''}`}>
        {value}
      </span>
        )}
    </div>
);

export default TransactionDetails;