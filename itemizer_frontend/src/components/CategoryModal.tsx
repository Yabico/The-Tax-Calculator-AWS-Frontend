// src/components/CategoryModal.tsx
import React from 'react';
import type { Transaction } from '../types';

// Define standard categories for your app
const CATEGORIES = ["Groceries", "Entertainment", "Income", "Transport", "Shopping", "Utilities", "Health", "Dining"];

interface CategoryModalProps {
    transaction: Transaction | null;
    onClose: () => void;
    onSave: (transactionId: string, newCategory: string) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ transaction, onClose, onSave }) => {
    if (!transaction) return null;

    // Handle clicking on the backdrop to close
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Modal Header */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Categorize</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Transaction: <span className="font-medium text-gray-700">{transaction.merchant}</span>
                            </p>
                        </div>
                        <span className="text-lg font-bold text-gray-900">
              ${transaction.amount.toFixed(2)}
            </span>
                    </div>
                </div>

                {/* Category Grid */}
                <div className="p-6">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 block">
                        Select a Category
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => onSave(transaction.id, cat)}
                                className={`py-2.5 px-4 rounded-xl text-sm font-semibold transition-all border-2
                  ${transaction.primaryCategory === cat
                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                    : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100 hover:border-gray-200'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryModal;