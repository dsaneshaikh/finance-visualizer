"use client";

import { useState } from "react";
import "../styles/budgetForm.css";

export default function BudgetForm({ categories, budgets, onBudgetUpdate }) {
  const [inputs, setInputs] = useState(() => {
    const initial = {};
    categories.forEach((cat) => {
      initial[cat] = budgets[cat]?.amount || "";
    });
    return initial;
  });

  const handleChange = (e, category) => {
    setInputs((prev) => ({
      ...prev,
      [category]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    for (const category of categories) {
      const raw = inputs[category];
      const value = parseFloat(raw);
      if (!isNaN(value)) {
        onBudgetUpdate(category, value);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="budget-form">
      <h2 className="budget-title">Set Budgets</h2>
      <div className="budget-list">
        {categories.map((category) => (
          <div key={category} className="budget-item">
            <label className="budget-label">{category}</label>
            <input
              type="number"
              className="budget-input"
              value={inputs[category]}
              onChange={(e) => handleChange(e, category)}
              placeholder="Enter budget"
            />
          </div>
        ))}
      </div>
      <button type="submit" className="budget-save-button">
        Save Budgets
      </button>
    </form>
  );
}
