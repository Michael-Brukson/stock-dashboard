import React, { useEffect, useMemo, useState } from "react";
import Controls from "../components/Controls";
import Table from "../components/Table.tsx";
import Chart from "../components/Chart";

interface QuoteRow {
  symbol: string;
  name?: string;
  price: number;
  changesPercentage?: number;
  change?: number;
  timestamp?: number;
}

interface HistoricalItem {
  date: string;
  epsEstimate: number;
  epsActual: number | null;
}

const DEFAULT_SYMBOLS = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA"];
const DEMO_KEY = "demo";

export default function Dashboard() {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem("api_key") || DEMO_KEY);
  const [symbolsInput, setSymbolsInput] = useState<string>(() => localStorage.getItem("symbols") || DEFAULT_SYMBOLS.join(","));
  const [data, setData] = useState<QuoteRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof QuoteRow>("symbol");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<string | null>(null);
  const [hist, setHist] = useState<HistoricalItem[] | null>(null);
  const [histLoading, setHistLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const symbols = useMemo(() => symbolsInput.split(/[\,\s]+/).map(s => s.trim().toUpperCase()).filter(Boolean), [symbolsInput]);

  useEffect(() => { localStorage.setItem("api_key", apiKey); }, [apiKey]);
  useEffect(() => { localStorage.setItem("symbols", symbolsInput); }, [symbolsInput]);

  const fetchQuotes = async () => {
    if (!symbols.length) return;
    setLoading(true); setError(null);
    try {
      const quotes = await Promise.all(
        symbols.map(async (symbol) => {
          const [quoteRes, profileRes] = await Promise.all([
            fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`),
            fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`)
          ]);
          
          if (!quoteRes.ok || !profileRes.ok) {
            throw new Error(`HTTP ${quoteRes.status}/${profileRes.status} for ${symbol}`);
          }
          
          const quote = await quoteRes.json();
          const profile = await profileRes.json();
          
          return {
            symbol,
            name: profile.name || symbol,
            price: quote.c || 0, // current price
            changesPercentage: quote.dp || 0, // percent change
            change: quote.d || 0, // change
            timestamp: quote.t || Date.now() / 1000,
          };
        })
      );
      
      setData(quotes);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch quotes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuotes(); }, [symbolsInput, apiKey]);

  useEffect(() => {
    if (!autoRefresh) return;
    const t = setInterval(fetchQuotes, 60000);
    return () => clearInterval(t);
  }, [autoRefresh, symbolsInput, apiKey]);

  useEffect(() => {
    const run = async () => {
      if (!selected) { setHist(null); return; }
      setHistLoading(true);
      try {
        // Get earnings calendar data for the selected symbol
        const to = new Date().toISOString().split('T')[0];
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 365); // Go back 3650 days
        const from = fromDate.toISOString().split('T')[0];
        
        const url = `https://finnhub.io/api/v1/calendar/earnings?symbol=${selected}&from=${from}&to=${to}&token=${apiKey}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        
        if (json.earningsCalendar && json.earningsCalendar.length > 0) {
            
            const earningsData = json.earningsCalendar;
            console.log(earningsData);
          
          const arr: HistoricalItem[] = earningsData.map((earning: any) => ({
            date: earning.date,
            epsEstimate: earning.epsEstimate || 0,
            epsActual: earning.epsActual || null
          }));
          
          // Sort by date
          arr.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          setHist(arr);
        } else {
          setHist(null);
        }
      } catch (e) {
        setHist(null);
      } finally {
        setHistLoading(false);
      }
    };
    run();
  }, [selected, apiKey]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const subset = q
      ? data.filter(r => r.symbol.toLowerCase().includes(q) || (r.name || "").toLowerCase().includes(q))
      : data;
    const sorted = [...subset].sort((a, b) => {
      const va = a[sortBy];
      const vb = b[sortBy];
      let cmp = 0;
      if (typeof va === "number" && typeof vb === "number") cmp = va - vb;
      else cmp = String(va || "").localeCompare(String(vb || ""));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [data, search, sortBy, sortDir]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Stock Price Dashboard</h1>

        <Controls
          apiKey={apiKey}
          setApiKey={setApiKey}
          symbolsInput={symbolsInput}
          setSymbolsInput={setSymbolsInput}
          onRefresh={fetchQuotes}
          loading={loading}
          autoRefresh={autoRefresh}
          setAutoRefresh={setAutoRefresh}
          search={search}
          setSearch={setSearch}
        />

        <Table
          data={data}
          loading={loading}
          error={error}
          filtered={filtered}
          selected={selected}
          setSelected={setSelected}
          sortBy={sortBy}
          sortDir={sortDir}
          setSortBy={(k) => setSortBy(k as keyof QuoteRow)}
          setSortDir={setSortDir}
        />

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">{selected ? `Earnings Calendar : ${selected}` : "Earnings Chart"}</h2>
          <Chart selected={selected} hist={hist} histLoading={histLoading} />
        </div>

        <footer className="mt-8 text-xs text-gray-500">
          Data source: <a className="underline" href="https://finnhub.io/docs/api" target="_blank" rel="noreferrer">Finnhub</a>
        </footer>
      </div>
    </div>
  );
}
