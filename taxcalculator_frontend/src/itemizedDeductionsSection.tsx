import { useMemo } from "react";
import { formatCurrency, unformatCurrency } from "./utils/utility.ts";

type Itemized = {
    charitableContributionsCash: string;
    salt: string;
    mortgageInterest: string;
    medicalExpenses: string;
    gamblingLosses: string;
    investmentInterest: string;
};

type Props = {
    agi: number;
    itemized: Itemized;
    onChange: (field: keyof Itemized, value: string) => void;
};

const formatCurrencyDescription = (value: number) =>
    `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function ItemizedDeductionsSection({
                                                      agi,
                                                      itemized,
                                                      onChange,
                                                  }: Props) {
    const caps = useMemo(
        () => ({
            charitableContributionsCash: agi * 0.6,
            salt: 10_000,
            medicalThreshold: agi * 0.075,
        }),
        [agi]
    );

    const handleChange = (
        field: keyof Itemized,
        value: string,
        max?: number
    ) => {
        const numeric = Math.max(0, Number(value) || 0);
        const capped = max !== undefined ? Math.min(numeric, max) : numeric;
        onChange(field, capped.toString());
    };

    return (
        <div className="space-y-2">

            {/* Charitable Contributions (Cash / Tithe) */}
            <section className="rounded-lg border p-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Charitable Contributions (Cash / Tithe)
                </label>
                <input
                    type="text"
                    value={formatCurrency(itemized.charitableContributionsCash)}
                    onChange={(e) => {
                        const raw = unformatCurrency(e.target.value);
                        handleChange(
                            "charitableContributionsCash",
                            raw,
                            caps.charitableContributionsCash
                        );
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g. 5,000"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Deductible up to {formatCurrencyDescription(caps.charitableContributionsCash)} (60% of AGI)
                </p>
            </section>

            {/* State & Local Taxes (SALT) */}
            <section className="rounded-lg border p-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    State & Local Taxes (Income + Property)
                </label>
                <input
                    type="text"
                    value={formatCurrency(itemized.salt)}
                    onChange={(e) => {
                        const raw = unformatCurrency(e.target.value);
                        handleChange(
                            "salt",
                            raw,
                            caps.salt
                        );
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g. 10,000"
                />
                <p className="text-xs text-gray-500 mt-1">
                    IRS hard cap: $10,000
                </p>
            </section>

            {/* Mortgage Interest */}
            <section className="rounded-lg border p-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Mortgage Interest
                </label>
                <input
                    type="text"
                    value={formatCurrency(itemized.mortgageInterest)}
                    onChange={(e) => {
                        const raw = unformatCurrency(e.target.value);
                        handleChange(
                            "mortgageInterest",
                            raw
                        );
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Interest paid in the year"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Deductible on acquisition debt (up to $750,000 loan balance)
                </p>
            </section>

            {/* Medical Expenses */}
            <section className="rounded-lg border p-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Medical & Dental Expenses
                </label>
                <input
                    type="text"
                    value={formatCurrency(itemized.medicalExpenses)}
                    onChange={(e) => {
                        const raw = unformatCurrency(e.target.value);
                        handleChange(
                            "medicalExpenses",
                            raw
                        );
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Total medical expenses paid"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Only amounts above {formatCurrencyDescription(caps.medicalThreshold)} (7.5% of AGI) are deductible
                </p>
            </section>

            {/* Gambling Losses */}
            <section className="rounded-lg border p-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Gambling Losses
                </label>
                <input
                    type="text"
                    value={formatCurrency(itemized.gamblingLosses)}
                    onChange={(e) => {
                        const raw = unformatCurrency(e.target.value);
                        handleChange(
                            "gamblingLosses",
                            raw
                        );
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Up to gambling winnings"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Deductible only up to gambling winnings
                </p>
            </section>

            {/* Investment Interest */}
            <section className="rounded-lg border p-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Investment Interest Expense
                </label>
                <input
                    type="text"
                    value={formatCurrency(itemized.investmentInterest)}
                    onChange={(e) => {
                        const raw = unformatCurrency(e.target.value);
                        handleChange(
                            "investmentInterest",
                            raw
                        );
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Interest on margin loans"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Deductible up to net investment income
                </p>
            </section>

        </div>
    );
}
