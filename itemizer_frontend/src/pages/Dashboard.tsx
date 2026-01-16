import PlaidLinkSection from "../components/PlaidLinkSection.tsx";
import {useTransactions} from "../hooks/useTransactions.ts";
import {useMemo, useState} from "react";
import FilterSidebar from "../components/FilterSidebar.tsx";
import TransactionFeed from "../components/TransactionFeed.tsx";
import type {Transaction} from "../types.ts";
import SpendingOverview from "../components/SpendingOverview.tsx";
import TransactionDetails from "../components/TransactionDetails.tsx";
import CategoryModal from "../components/CategoryModal.tsx";
import {DashboardStats} from "../components/DashboardStats.tsx";

const Dashboard = () => {
    const {
        transactions,
        filteredTransactions,
        isSyncing,
        handlePlaidSuccess,
        updateTransactionCategory,
        filters,
        accounts,
        totalBalance
    } = useTransactions();

    // 2. UI-ONLY STATE: Manage panels and view modes
    const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [isDetailedView, setIsDetailedView] = useState(false);

    // 3. DERIVED DATA: Get unique categories for the sidebar
    const uniqueCategories = useMemo(() => {
        const cats = new Set(transactions.map(tx => tx.primaryCategory));
        return ['All', ...Array.from(cats)];
    }, [transactions]);

    // 4. WRAPPER HANDLER: Bridge the hook logic with UI state (closing modals)
    const handleSaveCategory = (id: string, newCategory: string) => {
        updateTransactionCategory(id, newCategory);
        setEditingTransaction(null); // Close modal

        // If the sidebar detail is open, update its local view too
        if (viewingTransaction?.id === id) {
            setViewingTransaction({ ...viewingTransaction, primaryCategory: newCategory });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans transition-colors duration-500">
            <header className="max-w-5xl mx-auto mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Itemizer</h1>
                    <p className="text-gray-500 font-medium">Personal Finance Dashboard</p>
                </div>
                {isSyncing && (
                    <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 shadow-sm animate-pulse">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                        <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">Bank Syncing</span>
                    </div>
                )}
            </header>

            <main className="max-w-5xl mx-auto">
                <PlaidLinkSection onLinkSuccess={handlePlaidSuccess} />

                {accounts.length > 0 && (
                    <DashboardStats
                        accounts={accounts}
                        totalBalance={totalBalance}
                    />
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Analytics & Filters */}
                    <aside className="lg:col-span-1 space-y-6">
                        <SpendingOverview transactions={filteredTransactions} />
                        <FilterSidebar
                            filters={filters}
                            categories={uniqueCategories}
                        />
                    </aside>

                    {/* Right: The Transaction Feed */}
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-4 px-2">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                {filteredTransactions.length} Transactions Found
                            </h3>

                            <button
                                onClick={() => setIsDetailedView(!isDetailedView)}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all border
                                ${isDetailedView
                                    ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                            >
                                {isDetailedView ? '✨ Detailed' : '📁 Summary'}
                            </button>
                        </div>

                        <TransactionFeed
                            transactions={filteredTransactions}
                            onTransactionClick={(tx) => setViewingTransaction(tx)}
                            isDetailedView={isDetailedView}
                        />
                    </div>
                </div>
            </main>

            {/* Global UI Components (Modals/Overlays) */}
            <TransactionDetails
                transaction={viewingTransaction}
                onClose={() => setViewingTransaction(null)}
                onEditCategory={(tx) => setEditingTransaction(tx)}
            />

            <CategoryModal
                transaction={editingTransaction}
                onClose={() => setEditingTransaction(null)}
                onSave={handleSaveCategory}
            />
        </div>
    );
};

export default Dashboard;