"use client";

import { useState, useEffect } from "react";

export default function TransactionForm({
  onAdd,
  onUpdate,
  onCancel,
  editingTxn,
  categories = [],
}) {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    date: "",
    category: categories[0] || "",
  });

  useEffect(() => {
    if (editingTxn) {
      const dateOnly = editingTxn.date.split("T")[0];
      setForm({
        description: editingTxn.description,
        amount: editingTxn.amount.toString(),
        date: dateOnly,
        category: editingTxn.category || categories[0],
      });
    } else {
      setForm({
        description: "",
        amount: "",
        date: "",
        category: categories[0] || "",
      });
    }
  }, [editingTxn, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description.trim()) return alert("Description is required");
    if (!form.amount || isNaN(form.amount))
      return alert("Valid amount is required");
    if (!form.date) return alert("Date is required");

    const payload = {
      ...form,
      amount: parseFloat(form.amount),
      category: form.category,
      id: editingTxn?.id,
    };

    if (editingTxn) {
      onUpdate(payload);
      onCancel();
    } else {
      onAdd(payload);
    }

    if (!editingTxn) {
      setForm({
        description: "",
        amount: "",
        date: "",
        category: categories[0] || "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <div className="form-grid">
        {/* Description */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            className="form-input"
            placeholder="e.g. Groceries"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* Amount */}
        <div className="form-group">
          <label htmlFor="amount" className="form-label">
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            className="form-input"
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange}
          />
        </div>

        {/* Date */}
        <div className="form-group full-width">
          <label htmlFor="date" className="form-label">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            className="form-input"
            value={form.date}
            onChange={handleChange}
          />
        </div>

        {/* Category */}
        <div className="form-group full-width">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="form-input"
            value={form.category}
            onChange={handleChange}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-actions full-width">
        <button type="submit" className="btn-primary">
          {editingTxn ? "Update Transaction" : "Add Transaction"}
        </button>
        {editingTxn && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
