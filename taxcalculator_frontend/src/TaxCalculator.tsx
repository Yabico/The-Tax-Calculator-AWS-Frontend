import React, { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import {US_STATES} from "./utils/usStates.ts";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import {TaxBracketTable} from "./TaxBracketTable.tsx";
import type {
    TaxFormData,
    TaxResult,
} from "./types/TaxCalculatorTypes.ts";

const formatCurrency = (value: string) => {
    if (!value) return "";
    const number = value.replace(/\D/g, "");
    return Number(number).toLocaleString();
};

const unformatCurrency = (value: string) =>
    value.replace(/\D/g, "");

const TaxCalculator: React.FC = () => {
    const [formData, setFormData] = useState<TaxFormData>({
        grossIncome: '',
        state: '',
        filingStatus: '',
        itemizedDeductions: '',
        tithe: '',
        // logCalculations: false
    });

    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [isLogsOpen, setIsLogsOpen] = useState(false);

    const [result, setResult] = useState<TaxResult | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [grossIncomeDisplay, setGrossIncomeDisplay] = useState("");
    const [itemizedDeductionsDisplay, setItemizedDeductionsDisplay] = useState("");

    const canOpenLogs = Boolean(result?.taxCalculations);


    const filingStatuses = [
        { value: 'single', label: 'Single' },
        { value: 'married_filing_jointly', label: 'Married Filing Jointly' },
        { value: 'married_filing_separately', label: 'Married Filing Separately' },
        { value: 'head_of_household', label: 'Head of Household' },
    ];

    useEffect(() => {
        const root = document.documentElement; // <html>
        if (isDarkMode) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [isDarkMode]);

    const customSelectStyles = {
        control: (base: any) => ({
            ...base,
            minHeight: "36px",
            fontSize: "0.875rem",
            backgroundColor: isDarkMode ? "#374151" : "white", // gray-700 vs white
            borderColor: isDarkMode ? "#4B5563" : "#D1D5DB",     // gray-600 vs gray-300
            color: isDarkMode ? "white" : "#111827",
        }),
        menu: (base: any) => ({
            ...base,
            marginTop: "2px",
            backgroundColor: isDarkMode ? "#374151" : "white",
            zIndex: 9999,
        }),
        input: (base: any) => ({
            ...base,
            color: isDarkMode ? "white" : "#111827",
            margin: 0,
            padding: 0,
        }),
        singleValue: (base: any) => ({
            ...base,
            color: isDarkMode ? "white" : "#111827",
        }),
        placeholder: (base: any) => ({
            ...base,
            color: isDarkMode ? "#9CA3AF" : "#6B7280", // gray-400 vs gray-500
        }),
        option: (base: any, state: { isFocused: boolean }) => ({
            ...base,
            fontSize: "0.875rem",
            padding: "6px 10px",
            // Dark mode focus: gray-600, Light mode focus: indigo-50
            backgroundColor: state.isFocused
                ? (isDarkMode ? "#4B5563" : "#EEF2FF")
                : (isDarkMode ? "#374151" : "white"),
            color: isDarkMode ? "white" : "#111827",
            cursor: "pointer"
        }),
        menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        const isCheckbox = type === 'checkbox';
        const checked = isCheckbox ? (e.target as HTMLInputElement).checked : false;

        setFormData((prev) => ({
            ...prev,
            [name]: isCheckbox ? checked : value,
        }));
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // 4. API Integration with Java Backend
            // Replace with your actual Java Controller Endpoint
            const requestBody = {
                grossIncome: parseFloat(formData.grossIncome) || 0,
                state: formData.state,
                filingStatus: formData.filingStatus,
                itemizedDeductions: parseFloat(formData.itemizedDeductions) || 0,
                tithe: parseFloat(formData.tithe) || 0,
                // logCalculations: formData.logCalculations,
            }
            console.log(`Request Body: ${JSON.stringify(requestBody)}`);

            const response = await fetch('https://muwucpnoz6.execute-api.us-east-1.amazonaws.com/prod/calculate-tax', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) throw new Error('Calculation failed. Please check inputs.');

            const data = await response.json();
            // const logs = formData.logCalculations && data.taxCalculations
            //     ? buildTaxLogs(data.taxCalculations)
            //     : undefined;

            setResult({
                totalTax: data.totalTaxPaid,
                effectiveRate: (data.totalTaxPaid / parseFloat(formData.grossIncome)) * 100,
                // logs,
                taxCalculations: data.taxCalculations
            });
            console.log(`Response: ${JSON.stringify(data)}`);

        } catch (err) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setError(err.message);
            // For demo purposes, let's mock a success if backend isn't running
            // Remove this mock block in production
        } finally {
            setLoading(false);
        }
    };

    return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section with Toggle */}
                    <div className="flex justify-between items-start mb-10">
                        <div className="text-left">
                            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                                Tax Estimator
                            </h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Enter your financial details to calculate your estimated liability.
                            </p>
                        </div>

                        {/* Dark Mode Toggle Button */}
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {isDarkMode ? (
                                // Sun Icon
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                // Moon Icon
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden md:flex border dark:border-gray-700 transition-colors duration-200">
                        {/* LEFT SIDE: The Form */}
                        <div className="p-8 md:w-1/2 bg-white dark:bg-gray-800">
                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* Gross Income */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Gross Income ($)
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={grossIncomeDisplay}
                                        onChange={(e) => {
                                            const raw = unformatCurrency(e.target.value);
                                            setGrossIncomeDisplay(formatCurrency(raw));
                                            setFormData(prev => ({
                                                ...prev,
                                                grossIncome: raw
                                            }));
                                        }}
                                        placeholder="e.g. 158,000"
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />

                                </div>

                                {/* State & Filing Status Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            State
                                        </label>
                                        <Select
                                            options={US_STATES}
                                            value={US_STATES.find(s => s.value === formData.state)}
                                            onChange={(selectedOption) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    state: selectedOption?.value || "",
                                                }));
                                            }}
                                            isSearchable
                                            placeholder="State..."
                                            className="mt-1"
                                            classNamePrefix="react-select"
                                            menuPortalTarget={document.body}
                                            menuPosition="fixed"
                                            styles={customSelectStyles}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                        <Select
                                            options={filingStatuses}
                                            value={filingStatuses.find(fs => fs.value === formData.filingStatus)}
                                            onChange={(selectedOption) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    filingStatus: selectedOption?.value || "",
                                                }));
                                            }}
                                            isSearchable
                                            placeholder="Status"
                                            className="mt-1"
                                            classNamePrefix="react-select"
                                            menuPortalTarget={document.body}
                                            menuPosition="fixed"
                                            styles={customSelectStyles}
                                        />
                                    </div>
                                </div>

                                {/* Deductions & Tithe Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Deductions ($)
                                        </label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            name="itemizedDeductions"
                                            value={itemizedDeductionsDisplay}
                                            onChange={(e) => {
                                                const raw = unformatCurrency(e.target.value);
                                                setItemizedDeductionsDisplay(formatCurrency(raw));
                                                setFormData(prev => ({
                                                    ...prev,
                                                    itemizedDeductions: raw
                                                }));
                                            }}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                            placeholder="e.g. 14,600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Tithe ($)
                                        </label>
                                        <input
                                            type="number"
                                            name="tithe"
                                            min="0"
                                            value={formData.tithe}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                            placeholder="0.00"
                                        />
                                    </div>


                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
                                >
                                    {loading ? 'Calculating...' : 'Calculate Tax'}
                                </button>
                            </form>
                        </div>

                        {/* RIGHT SIDE: Results Display */}
                        <div className="p-8 md:w-1/2 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col justify-center transition-colors duration-200">
                            {error && (
                                <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 border border-red-100 dark:border-red-900">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                                            <div className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!result && !error && (
                                <div className="text-center text-gray-400 dark:text-gray-500">
                                    <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <p className="mt-2 text-sm">Fill out the form to see results</p>
                                </div>
                            )}
                            <AnimatePresence mode="wait">
                                {result && (
                                    <motion.div
                                        key = "result"
                                        initial = {{ opacity: 0, y: 12 }}
                                        animate = {{ opacity: 1, y: 0 }}
                                        exit = {{ opacity: 0, y: -8 }}
                                        transition = {{ duration: 0.35, ease: "easeOut" }}
                                        className="space-y-6"
                                    >
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estimated
                                                Tax</p>
                                            <p className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white">
                                                ${result.totalTax.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                            </p>
                                        </div>

                                        <div
                                            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-600 dark:text-gray-300">Effective Rate</span>
                                                <span
                                                    className="font-bold text-indigo-600 dark:text-indigo-400">{result.effectiveRate.toFixed(2)}%</span>
                                            </div>
                                            {/* Progress bar visual for rate */}
                                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                                                <div className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full"
                                                     style={{width: `${Math.min(result.effectiveRate, 100)}%`}}></div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <button
                                    onClick={() => setIsLogsOpen(!isLogsOpen)}
                                    disabled={!canOpenLogs}
                                    className={`w-full mt-2 text-sm font-medium transition-colors
    ${
                                        canOpenLogs
                                            ? "text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                                            : "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                    }`}
                                >
                                    View calculation details
                                </button>


                            </AnimatePresence>
                        </div>
                    </div>
                    <AnimatePresence>
                        {isLogsOpen && result?.taxCalculations && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                                className="overflow-hidden mt-2"
                            >
                                <div className="h-px bg-linear-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent mb-2" />
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 border-t-0">

                                    {/* Header */}
                                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Tax Calculation Details
                                        </h3>
                                        <button
                                            onClick={() => setIsLogsOpen(false)}
                                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 space-y-6">
                                        {/* Federal */}
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                                                Federal Tax Breakdown
                                            </h4>
                                            <div className="mb-4 grid grid-cols-3 gap-4 text-sm">
                                                <div className="bg-gray-100 dark:bg-gray-700 rounded p-3">
                                                    <p className="text-gray-500 dark:text-gray-400">Standard Deduction</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        ${result.taxCalculations.federalTaxCalculations.standardDeduction.toLocaleString()}
                                                    </p>
                                                </div>

                                                <div className="bg-gray-100 dark:bg-gray-700 rounded p-3">
                                                    <p className="text-gray-500 dark:text-gray-400">Itemized Deduction</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        ${result.taxCalculations.federalTaxCalculations.itemizedDeductions.toLocaleString()}
                                                    </p>
                                                </div>

                                                <div className="bg-gray-100 dark:bg-gray-700 rounded p-3">
                                                    <p className="text-gray-500 dark:text-gray-400">Taxable Income</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        ${result.taxCalculations.federalTaxCalculations.taxableIncome.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <TaxBracketTable
                                                brackets={
                                                    result.taxCalculations.federalTaxCalculations
                                                        .taxBracketCalculations
                                                }
                                                type = "Federal"
                                            />
                                        </div>

                                        {/* State */}
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                                                State Tax Breakdown
                                            </h4>
                                            <div className="mb-4 grid grid-cols-3 gap-4 text-sm">
                                                <div className="bg-gray-100 dark:bg-gray-700 rounded p-3">
                                                    <p className="text-gray-500 dark:text-gray-400">Standard Deduction</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        ${result.taxCalculations.stateTaxCalculations.standardDeduction.toLocaleString()}
                                                    </p>
                                                </div>

                                                <div className="bg-gray-100 dark:bg-gray-700 rounded p-3">
                                                    <p className="text-gray-500 dark:text-gray-400">Itemized Deduction</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        ${result.taxCalculations.stateTaxCalculations.itemizedDeductions.toLocaleString()}
                                                    </p>
                                                </div>

                                                <div className="bg-gray-100 dark:bg-gray-700 rounded p-3">
                                                    <p className="text-gray-500 dark:text-gray-400">Taxable Income</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        ${result.taxCalculations.stateTaxCalculations.taxableIncome.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <TaxBracketTable
                                                brackets={
                                                    result.taxCalculations.stateTaxCalculations
                                                        .taxBracketCalculations
                                                }
                                                type = "State"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
    );
};

export default TaxCalculator
