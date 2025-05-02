import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import "../styles/budgetchart.css";

/**
 * @param {{ budgets: Record<string, { amount: number }>, expenses: Record<string, number>, categories: string[] }} props
 */
export default function BudgetChart({ budgets, expenses, categories }) {
  const data = Object.keys(budgets)
    .filter(
      (category) =>
        category && category !== "null" && categories.includes(category)
    )
    .map((category) => ({
      name: category,
      budget: budgets[category]?.amount || 0,
      actual: expenses[category] || 0,
    }));

  if (data.length === 0) {
    return (
      <div className="budget-chart">
        <h3>Budget vs Actual</h3>
        <div className="no-data">No budget data available</div>
      </div>
    );
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="budget-chart">
      <h3>Budget vs Actual</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="budget"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, value }) => `${name}: ₹${value}`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`budget-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Pie
            data={data}
            dataKey="actual"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={85}
            outerRadius={100}
            label={({ name, value }) => `${name}: ₹${value}`}
          />

          <Legend
            formatter={(value) => (
              <span style={{ color: "#333" }}>{value}</span>
            )}
          />
          <Tooltip
            formatter={(value, name) => [`₹${value.toFixed(2)}`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
