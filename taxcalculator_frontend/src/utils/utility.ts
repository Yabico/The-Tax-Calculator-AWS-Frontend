export const formatCurrency = (value: string) => {
    if (!value) return "";
    const number = value.replace(/\D/g, "");
    return Number(number).toLocaleString();
};

export const unformatCurrency = (value: string) =>
    value.replace(/\D/g, "");