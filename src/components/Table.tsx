import React from "react";
import Row from "./Row";

interface Props {
  data: any[];
  loading: boolean;
  error: string | null;
  filtered: any[];
  selected: string | null;
  setSelected: (s: string | null) => void;
  sortBy: string;
  sortDir: "asc" | "desc";
  setSortBy: (key: string) => void;
  setSortDir: (d: "asc" | "desc") => void;
}

export default function Table({ data, loading, error, filtered, selected, setSelected, sortBy, sortDir, setSortBy, setSortDir }: Props) {
  const header = (key: string, label: string) => (
    <th
      key={String(key)}
      className="px-4 py-2 text-left text-sm font-semibold text-gray-700 cursor-pointer select-none"
      onClick={() => {
        if (sortBy === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
        else { setSortBy(key); setSortDir("asc"); }
      }}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortBy === key && (
          <span className="text-xs text-gray-500">{sortDir === "asc" ? "▲" : "▼"}</span>
        )}
      </span>
    </th>
  );

  return (
    <div className="overflow-x-auto rounded-2xl shadow bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            {header("symbol", "Symbol")}
            {header("name", "Name")}
            {header("price", "Price ($)")}
            {header("changesPercentage", "Change %")}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr><td colSpan={5} className="py-6 text-center animate-pulse">Loading quotes…</td></tr>
          )}
          {!loading && error && (
            <tr><td colSpan={5} className="py-6 text-center text-red-600">{error}</td></tr>
          )}
          {!loading && !error && filtered.length === 0 && (
            <tr><td colSpan={5} className="py-6 text-center text-gray-600">No matches.</td></tr>
          )}
          {!loading && !error && filtered.map(row => (
            <Row key={row.symbol} row={row} selected={selected} onSelect={(s) => setSelected(selected === s ? null : s)} />
          ))}
        </tbody>
      </table>
    </div>
  );
}