import React, { useState } from "react";
import type { ChangeEvent } from "react";

interface TaxFormData {
    grossIncome: string;
    state: string;
    filingStatus: string;
    itemizedDeductions: string;
    tithe: string;
    logCalculations: boolean;
}

interface TaxResult {
    totalTax: number;
    effectiveRate: number;
    logs: string[];
}

const TaxCalculator: React.FC = () => {
    const [formData, setFormData] = useState<TaxFormData>({
        grossIncome: '',
        state: 'CA',
        filingStatus: 'single',
        itemizedDeductions: '',
        tithe: '',
        logCalculations: false
    });

    const [result, setResult] = useState<TaxResult | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const states = [
        { code: 'CA', name: 'California' },
        { code: 'NY', name: 'New York' },
        { code: 'TX', name: 'Texas' },
        { code: 'FL', name: 'Florida' },
    ];

    const filingStatuses = [
        { value: 'single', label: 'Single' },
        { value: 'married_filing_jointly', label: 'Married Filing Jointly' },
        { value: 'married_filing_separately', label: 'Married Filing Separately' },
        { value: 'head_of_household', label: 'Head of Household' },
    ];

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
                logCalculations: formData.logCalculations,
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
            setResult({
                totalTax: data.taxPaid,
                effectiveRate: (data.taxPaid / parseFloat(formData.grossIncome)) * 100,
                logs: []
            });
            console.log(`Response: ${JSON.stringify(data)}`);

        } catch (err) {
            // @ts-ignore
            setError(err.message);
            // For demo purposes, let's mock a success if backend isn't running
            // Remove this mock block in production
        } finally {
            setLoading(false);
        }
    };

    return (<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900">
                    Tax Estimator
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    Enter your financial details to calculate your estimated liability.
                </p>
            </div>

            <div className="bg-white shadow-xl rounded-lg overflow-hidden md:flex">
                {/* LEFT SIDE: The Form */}
                <div className="p-8 md:w-1/2 bg-white">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Gross Income */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Gross Income ($)
                            </label>
                            <input
                                type="number"
                                name="grossIncome"
                                required
                                min="0"
                                value={formData.grossIncome}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                placeholder="e.g. 85000"
                            />
                        </div>

                        {/* State & Filing Status Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">State</label>
                                <select
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                >
                                    {states.map((s) => (
                                        <option key={s.code} value={s.code}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    name="filingStatus"
                                    value={formData.filingStatus}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                >
                                    {filingStatuses.map((fs) => (
                                        <option key={fs.value} value={fs.value}>{fs.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Deductions & Tithe Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Deductions ($)
                                </label>
                                <input
                                    type="number"
                                    name="itemizedDeductions"
                                    min="0"
                                    value={formData.itemizedDeductions}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Tithe ($)
                                </label>
                                <input
                                    type="number"
                                    name="tithe"
                                    min="0"
                                    value={formData.tithe}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* Log Calculations Toggle */}
                        <div className="flex items-center">
                            <input
                                id="log-calculations"
                                name="logCalculations"
                                type="checkbox"
                                checked={formData.logCalculations}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="log-calculations" className="ml-2 block text-sm text-gray-900">
                                Show detailed calculation logs
                            </label>
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
                <div className="p-8 md:w-1/2 bg-gray-50 border-l border-gray-200 flex flex-col justify-center">
                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                                    <div className="mt-2 text-sm text-red-700">{error}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!result && !error && (
                        <div className="text-center text-gray-400">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <p className="mt-2 text-sm">Fill out the form to see results</p>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Estimated Tax</p>
                                <p className="mt-2 text-4xl font-extrabold text-gray-900">
                                    ${result.totalTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                            </div>

                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Effective Rate</span>
                                    <span className="font-bold text-indigo-600">{result.effectiveRate}%</span>
                                </div>
                                {/* Progress bar visual for rate */}
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${Math.min(result.effectiveRate, 100)}%` }}></div>
                                </div>
                            </div>

                            {/* Logs Section - Only shows if logCalculations was true and logs exist */}
                            {result.logs && result.logs.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Calculation Logs
                                    </h4>
                                    <div className="bg-gray-900 rounded-md p-4 overflow-y-auto max-h-48 text-left">
                      <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                        {result.logs.join('\n')}
                      </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
);
};

export default TaxCalculator
