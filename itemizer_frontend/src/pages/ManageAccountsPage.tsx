import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import { ArrowLeft, Landmark, CreditCard, RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react';

const ManageAccountsPage: React.FC = () => {
    const navigate = useNavigate();
    const { accounts, isSyncing } = useTransactions();

    // Group accounts by "Bank Name" (Assuming first word of name is the Bank)
    // Group accounts by the official Institution Name
    const groupedAccounts = useMemo(() => {
        return accounts.reduce((groups, acc) => {
            // Use the official field, fallback to "Other" just in case
            const bankName = acc.institutionName || 'Other';
            if (!groups[bankName]) groups[bankName] = [];
            groups[bankName].push(acc);
            return groups;
        }, {} as Record<string, typeof accounts>);
    }, [accounts]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-200"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Financial Institutions</h1>
                            <p className="text-gray-500 font-medium">Manage your linked accounts and credentials</p>
                        </div>
                    </div>

                    {isSyncing && (
                        <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-bold animate-pulse">
                            <RefreshCw size={14} className="animate-spin" />
                            UPDATING
                        </div>
                    )}
                </header>

                <div className="space-y-8">
                    {Object.entries(groupedAccounts).map(([bankName, bankAccounts]) => (
                        <section key={bankName} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                            {/* Institution Header */}
                            <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                        <Landmark size={24} className="text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{bankName}</h3>
                                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                                            <ShieldCheck size={12} className="text-green-400" />
                                            Connected via Plaid
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bank Balance</p>
                                    <p className="text-2xl font-black">
                                        ${bankAccounts.reduce((sum, a) => sum + a.balance, 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Account List */}
                            <div className="p-4">
                                <div className="grid gap-3">
                                    {bankAccounts.map((acc) => (
                                        <div
                                            key={acc.accountId}
                                            className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:border-blue-100 hover:bg-blue-50/20 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-white transition-colors">
                                                    {acc.subtype.includes('credit') ? <CreditCard size={18} className="text-gray-400" /> : <Landmark size={18} className="text-gray-400" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800">{acc.name}</p>
                                                    <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                                                        {acc.subtype} •••• {acc.mask}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-gray-900">
                                                    ${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </p>
                                                <button className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-auto">
                                                    View Transactions <ExternalLink size={10} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    ))}
                </div>

                {/* Footer Action */}
                <footer className="mt-12 p-8 border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <Landmark size={28} />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">Add another institution?</h4>
                    <p className="text-gray-500 text-sm mb-6 max-w-xs">Link your accounts from over 12,000 financial institutions globally.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-gray-200"
                    >
                        Connect New Bank
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ManageAccountsPage;