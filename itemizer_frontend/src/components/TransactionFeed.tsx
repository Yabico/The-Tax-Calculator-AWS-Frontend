import React from 'react';
import type { Transaction } from '../types';
import { Link } from 'react-router';

interface TransactionFeedProps {
    transactions: Transaction[];
    onTransactionClick: (transaction: Transaction) => void;
    isDetailedView: boolean;
}

const TransactionFeed: React.FC<TransactionFeedProps> = ({ transactions, onTransactionClick, isDetailedView }) => {

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const PREVIEW_LIMIT = 10;
    const recentTransactions = transactions.slice(0, PREVIEW_LIMIT);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
                <span className="text-sm text-gray-500">{recentTransactions.length} items</span>
            </div>

            {/* List */}
            {recentTransactions.length === 0 && (
                <div className="p-12 text-center">
                    <div className="text-gray-300 text-5xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-900">No transactions found</h3>
                    <p className="text-gray-500">Try adjusting your filters or search term.</p>
                </div>
            )}
            <ul>
                {recentTransactions.map((tx) => (
                    <li
                        key={tx.id}
                        // We now pass the entire transaction object up to the parent when clicked
                        onClick={() => onTransactionClick(tx)}
                        className="group flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-50 last:border-0 cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            {/* Logo / Icon */}
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
                ${tx.is_income ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                {tx.logo_initial}
                            </div>

                            {/* Details */}
                            <div>
                                <h3 className="font-semibold text-gray-900">{tx.merchant}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-400">{tx.date}</span>


                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold transition-all
                                        ${isDetailedView
                                        ? 'bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-tighter'
                                        : 'bg-gray-100 text-gray-800'}`}>
                                        {isDetailedView ? `# ${tx.detailedCategory}` : tx.primaryCategory}
                                    </span>
                                </div>
                            </div>

                        </div>

                        {/* Amount */}
                        <div className="text-right">
                            <p className={`font-bold ${tx.is_income ? 'text-green-600' : 'text-gray-900'}`}>
                                {tx.is_income ? '+' : '-'}{formatCurrency(tx.amount)}
                            </p>
                            {tx.status === 'pending' && (
                                <span className="text-xs text-amber-500 font-medium bg-amber-50 px-2 py-0.5 rounded-full">
                  Pending
                </span>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            <div className="p-4 bg-gray-50 text-center">
                <Link to="/transactions" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    View all transactions &rarr;
                </Link>
            </div>

        </div>
    );
};

export default TransactionFeed;