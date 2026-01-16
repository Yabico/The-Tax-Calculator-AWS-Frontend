export interface Account {
    accountId: string;
    name: string;
    mask: string;
    subtype: string;
    balance: number;
    institutionName: string;
}

export interface Transaction {
    accountId: string;
    accountName: string;
    accountMask: string;
    id: string;
    date: string;
    merchant: string;
    amount: number;
    primaryCategory: string;
    detailedCategory: string;
    status: 'posted' | 'pending';
    is_income: boolean;
    logo_initial: string;
    account_name?: string;
    payment_channel?: string;
    location?: string;
    website?: string;
    institutionName: string;
}

export interface syncResult {
    institutionInfo: InstitutionInfo;
    transactions: Transaction[];
    accounts: Account[];
}

export interface InstitutionInfo {
    name: string;
    id: string;
    logoUrl?: string;
}

export interface FilterState {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    activeCategory: string;
    setActiveCategory: (val: string) => void;
    dateRange: DateRangeKey;
    setDateRange: (val: DateRangeKey) => void;
}

export const DATE_RANGES = {
    '7D': 7,
    '30D': 30,
    '90D': 90,
    'ALL': 9999,
}

export type DateRangeKey = keyof typeof DATE_RANGES;