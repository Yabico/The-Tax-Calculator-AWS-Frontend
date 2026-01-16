// src/mockData.ts
// src/mockData.ts
import type {Transaction} from './types';

export const TRANSACTIONS: Transaction[] = [
    {
        id: "tx_1",
        date: "2024-02-14",
        merchant: "Spotify",
        amount: 14.99,
        primaryCategory: "Entertainment",
        detailedCategory: "Music Streaming Service",
        status: "pending",
        is_income: false,
        logo_initial: "S"
    },
    {
        id: "tx_2",
        date: "2024-02-13",
        merchant: "Whole Foods Market",
        amount: 142.50,
        primaryCategory: "Groceries",
        detailedCategory: "Snacks",
        status: "posted",
        is_income: false,
        logo_initial: "W"
    },
    {
        id: "tx_3",
        date: "2024-02-10",
        merchant: "Tech Corp Payroll",
        amount: 3200.00,
        primaryCategory: "Income",
        detailedCategory: "Salary",
        status: "posted",
        is_income: true,
        logo_initial: "T"
    },
    {
        id: "tx_4",
        date: "2024-02-09",
        merchant: "Uber",
        amount: 24.15,
        primaryCategory: "Transport",
        detailedCategory: "Uber ride",
        status: "posted",
        is_income: false,
        logo_initial: "U"
    },
    {
        id: "tx_1",
        date: "2024-02-14",
        merchant: "Spotify",
        amount: 14.99,
        primaryCategory: "Entertainment",
        detailedCategory: "Music Streaming Service",
        status: "pending",
        is_income: false,
        logo_initial: "S",
        payment_channel: "online",
        website: "spotify.com"
    },
    {
        id: "tx_2",
        date: "2024-02-13",
        merchant: "Whole Foods Market",
        amount: 142.50,
        primaryCategory: "Groceries",
        detailedCategory: "Snacks",
        status: "posted",
        is_income: false,
        logo_initial: "W",
        location: "Austin, TX",
        account_name: "Debit Card (*4421)"
    },
];