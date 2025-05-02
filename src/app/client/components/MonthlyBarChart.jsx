"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MonthlyBarChart({ transactions = [] }) {
  // Aggregate per month
  const grouped = transactions.reduce((acc, txn) => {
    const d = new Date(txn.date);
    if (isNaN(d)) return acc;
    const month = d.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    acc[month] = (acc[month] || 0) + txn.amount;
    return acc;
  }, {});

  const data = Object.keys(grouped)
    .map((month) => ({ month, total: grouped[month] }))
    .sort((a, b) => new Date(a.month) - new Date(b.month));

  if (data.length === 0) {
    return <div className="data-card">No transactions to chart.</div>;
  }

  return (
    <div className="chart-container">
      <h3 className="card-title">Monthly Expenses</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, bottom: 50, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis
            dataKey="month"
            angle={-45}
            textAnchor="end"
            interval={0}
            tick={{ fill: "var(--subtext)" }}
          />
          <YAxis
            tickFormatter={(v) => `₹${v}`}
            tick={{ fill: "var(--subtext)" }}
          />
          <Tooltip formatter={(v) => `₹${v.toFixed(2)}`} />
          <Bar dataKey="total" fill="var(--primary)" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
