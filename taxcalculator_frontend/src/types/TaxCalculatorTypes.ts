export interface TaxBracket {
    taxRate: number;
    lowerBound: number;
    upperBound: number;
}

export interface TaxBracketCalculationInfo {
    taxBracket: TaxBracket;
    taxableIncome: number;
    taxPaid: number;
}

export interface TaxCalculationInfo {
    taxPaid: number;
    taxableIncome: number;
    standardDeduction: number;
    itemizedDeductions: number;
    taxBracketCalculations: TaxBracketCalculationInfo[];
}

export interface TaxCalculatorCalculations {
    grossIncome: number;
    federalTaxCalculations: TaxCalculationInfo;
    stateTaxCalculations: TaxCalculationInfo;
}

export interface TaxFormData {
    grossIncome: string;
    state: string;
    filingStatus: string;
    useItemizedDeductions: boolean;
    itemized: {
        charitableContributionsCash: string;
        salt: string;
        mortgageInterest: string;
        medicalExpenses: string;
        gamblingLosses: string;
        investmentInterest: string;
    };
    totalItemizedDeductions: string;
}

export interface TaxResult {
    totalTax: number;
    effectiveRate: number;
    taxCalculations?: TaxCalculatorCalculations;
}
