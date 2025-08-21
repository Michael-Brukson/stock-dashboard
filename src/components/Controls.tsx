interface Props {
    apiKey: string;
    setApiKey: (val: string) => void;
    symbolsInput: string;
    setSymbolsInput: (val: string) => void;
    onRefresh: () => void;
    loading: boolean;
    autoRefresh: boolean;
    setAutoRefresh: (val: boolean) => void;
    search: string;
    setSearch: (val: string) => void;
}


export default function Controls(props: Props) {
    const { apiKey, setApiKey, symbolsInput, setSymbolsInput, onRefresh, loading, autoRefresh, setAutoRefresh, search, setSearch } = props;


    return (
        <>
            <div className="grid gap-3 md:grid-cols-3 items-end mb-4">
                <label className="flex flex-col">
                    <span className="text-sm text-gray-600 mb-1">API Key</span>
                    <input
                        className="px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={apiKey}
                        placeholder="demo or your key"
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                </label>
                <label className="flex flex-col md:col-span-2">
                    <span className="text-sm text-gray-600 mb-1">Symbols</span>
                    <input
                        className="px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={symbolsInput}
                        onChange={(e) => setSymbolsInput(e.target.value)}
                        placeholder="AAPL, MSFT, NVDA"
                    />
                </label>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
                <button
                    onClick={onRefresh}
                    className="px-3 py-2 rounded-2xl bg-blue-600 text-white shadow hover:bg-blue-700 active:scale-[.99]"
                    disabled={loading}
                >
                    Refresh
                </button>
                <label className="inline-flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={autoRefresh}
                        onChange={(e) => setAutoRefresh(e.target.checked)}
                    />
                    Auto-refresh every 60s
                </label>
                <input
                    className="px-3 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search symbol or name…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </>
    );
}