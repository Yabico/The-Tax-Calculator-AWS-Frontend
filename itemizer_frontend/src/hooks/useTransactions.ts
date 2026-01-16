import {useState, useMemo, useEffect } from 'react';
import {
    type Transaction,
    type DateRangeKey,
    DATE_RANGES,
    type Account,
    type syncResult,
} from '../types';

export const useTransactions = () => {

    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        const saved = localStorage.getItem('my_transactions');
        return saved ? JSON.parse(saved) : [];
    });

    const [accounts, setAccounts] = useState<Account[]>(() => {
        const saved = localStorage.getItem('my_accounts');
        return saved ? JSON.parse(saved) : [];
    });

    const [isSyncing, setIsSyncing] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [dateRange, setDateRange] = useState<DateRangeKey>('30D');

    useEffect(() => {
        localStorage.setItem('my_transactions', JSON.stringify(transactions));
        localStorage.setItem('my_accounts', JSON.stringify(accounts));
    }, [transactions, accounts]);

    const filteredTransactions = useMemo(() => {
        const now = new Date();
        const cutoff = new Date();
        cutoff.setDate(now.getDate() - DATE_RANGES[dateRange]);

        return transactions.filter((tx) => {
            const txDate = new Date(tx.date);
            const matchesDate = dateRange === 'ALL' || txDate >= cutoff;
            const matchesSearch = tx.merchant.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = activeCategory === 'All' || tx.primaryCategory === activeCategory;

            return matchesDate && matchesSearch && matchesCategory;
        });
    }, [transactions, searchTerm, activeCategory, dateRange]);

    const handlePlaidSuccess = async (publicToken: string) => {
        setIsSyncing(true);
        try {
            const response = await fetch("https://baee2wl750.execute-api.us-east-1.amazonaws.com/prod/exchange-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ public_token: publicToken })
            });

            if (!response.ok) throw new Error("Failed to exchange token");

            const data: syncResult = await response.json();
            console.log("Response data", data);
            const bankName = data.institutionInfo.name;
            const incomingAccounts: Account[] = data.accounts.map((acc: Account) => ({
                ...acc,
                institutionName: bankName
            }));


            const enrichedTransactions: Transaction[] = data.transactions.map((tx: Transaction) => {
                const account = incomingAccounts.find(a => a.accountId === tx.accountId);
                return {
                    ...tx,
                    institutionName: bankName,
                    accountName: account?.name || 'Unknown Account',
                    accountMask: account?.mask || '0000',
                };
            });

            // 3. Update Accounts State
            setAccounts((prev) => {
                const combined = [...incomingAccounts, ...prev];
                // Unique by account_id
                return Array.from(new Map(combined.map(a => [a.accountId, a])).values());
            });

            // 4. Update Transactions State (Existing logic + enrichment)
            setTransactions((prev) => {
                const combined = [...enrichedTransactions, ...prev];
                const unique = Array.from(new Map(combined.map(t => [t.id, t])).values());
                return unique.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            });

            // 5. Persist both to LocalStorage
            localStorage.setItem('my_accounts', JSON.stringify(incomingAccounts));

        } catch (error) {
            console.error("Sync Error:", error);
            alert("Bank connection failed. Please try again.");
        } finally {
            setIsSyncing(false);
        }
    };

    // 6. CATEGORY UPDATE: Logic for user-defined overrides
    const updateTransactionCategory = (id: string, newCategory: string) => {
        setTransactions(prev => prev.map(tx =>
            tx.id === id ? { ...tx, primaryCategory: newCategory } : tx
        ));
    };

    const totalBalance = useMemo(() => {
        return accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    }, [accounts]);

    return {
        transactions,
        filteredTransactions,
        isSyncing,
        handlePlaidSuccess,
        updateTransactionCategory,
        filters: {
            searchTerm,
            setSearchTerm,
            activeCategory,
            setActiveCategory,
            dateRange,
            setDateRange
        },
        accounts,
        totalBalance
    };
};