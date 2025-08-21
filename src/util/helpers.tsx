export function classNames(...xs: Array<string | boolean | undefined | null>) {
    return xs.filter(Boolean).join(" ");
}


export function pctColor(pct?: number) {
    if (pct === undefined || pct === null) return "text-gray-700";
    if (pct > 0) return "text-green-600";
    if (pct < 0) return "text-red-600";
    return "text-gray-700";
}