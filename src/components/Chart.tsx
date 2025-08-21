import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface Props {
  selected: string | null;
  hist: any[] | null;
  histLoading: boolean;
}

export default function Chart({ selected, hist, histLoading }: Props) {
  return (
    <div className="h-64 w-full rounded-2xl bg-white shadow flex items-center justify-center p-3">
      {selected ? (
        histLoading ? (
          <div className="animate-pulse">Loading chart…</div>
        ) : hist && hist.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hist} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <XAxis dataKey="date" hide />
              <YAxis domain={["dataMin", "dataMax"]} width={60} tickFormatter={(v) => `$${v.toFixed(2)}`} />
              <Tooltip 
                formatter={(v: any, name: string) => [`$${Number(v).toFixed(2)}`, name === 'epsEstimate' ? 'EPS Estimate' : 'EPS Actual']} 
                labelFormatter={(l) => `Date: ${l}`} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="epsEstimate" 
                stroke="#8884d8" 
                dot={false} 
                strokeWidth={2} 
                name="EPS Estimate"
              />
              <Line 
                type="monotone" 
                dataKey="epsActual" 
                stroke="#82ca9d" 
                dot={true} 
                strokeWidth={2} 
                name="EPS Actual"
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-gray-600">No earnings data available.</div>
        )
      ) : (
        <div className="text-gray-600">Select a row to load its earnings chart.</div>
      )}
    </div>
  );
}