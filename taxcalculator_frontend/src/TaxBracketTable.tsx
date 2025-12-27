type BracketCalculation = {
    taxBracket: {
        taxRate: number;
        lowerBound: number;
        upperBound: number;
    };
    taxableIncome: number;
    taxPaid: number;
};

type Props = {
    brackets: BracketCalculation[];
    type: string;
};

export function TaxBracketTable({ brackets, type }: Props) {
    if (!brackets?.length) return null;

    const totalTax = brackets.reduce((sum, b) => sum + b.taxPaid, 0);

    return (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="w-full max-w-4xl mx-auto rounded-lg border border-gray-700 overflow-hidden">
                <table className="w-full text-left text-sm font-sans">
                    <thead className="bg-gray-800 text-gray-300 uppercase text-xs tracking-wider">
                    <tr>
                        <th className="px-2 sm:px-4 py-3 font-semibold">Rate</th>
                        <th className="px-2 sm:px-4 py-3 font-semibold">Income Range</th>
                        <th className="px-2 sm:px-4 py-3 text-right font-semibold leading-tight">
                            <span className="hidden sm:inline">Taxable Income</span>
                            <span className="sm:hidden">Taxable<br/>Income</span>
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-right font-semibold">Tax Paid</th>
                    </tr>
                    </thead>

                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                    {brackets.map((b, i) => (
                        <tr
                            key={i}
                            className="text-gray-300 hover:bg-gray-800 transition-colors"
                        >
                            <td className="px-2 sm:px-4 py-3 whitespace-nowrap tabular-nums">
                                {(b.taxBracket.taxRate * 100).toFixed(1)}%
                            </td>

                            <td className="px-2 sm:px-4 py-3 tabular-nums">
                                <div className="flex flex-col sm:block text-xs sm:text-sm">
                                        <span className="text-gray-400 sm:text-gray-300">
                                            ${b.taxBracket.lowerBound.toLocaleString()}
                                        </span>
                                    <span className="sm:mx-1 text-gray-500">
                                            <span className="sm:hidden text-[10px] uppercase mr-1 font-medium tracking-wide">to</span>
                                            <span className="hidden sm:inline">–</span>
                                        </span>
                                    <span className="text-gray-300">
                                            ${b.taxBracket.upperBound.toLocaleString()}
                                        </span>
                                </div>
                            </td>

                            <td className="px-2 sm:px-4 py-3 text-right tabular-nums whitespace-nowrap text-xs sm:text-sm text-indigo-300 font-medium">
                                ${b.taxableIncome.toLocaleString()}
                            </td>

                            <td className="px-2 sm:px-4 py-3 text-right tabular-nums whitespace-nowrap text-xs sm:text-sm text-green-400 font-medium">
                                ${b.taxPaid.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                            </td>
                        </tr>
                    ))}
                    </tbody>

                    {/* 🔹 UPDATED FOOTER */}
                    <tfoot className="bg-gray-800 text-gray-200 font-bold text-xs sm:text-sm">
                    <tr>
                        {/* colSpan={4} makes this cell span the entire width of the table */}
                        <td className="px-2 sm:px-4 py-3" colSpan={4}>
                            <div className="flex items-center justify-between">
                                <span className="uppercase tracking-wider">Total {type} Tax</span>
                                <span className="tabular-nums text-green-400 text-base sm:text-sm">
                                    ${totalTax.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                                </span>
                            </div>
                        </td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}