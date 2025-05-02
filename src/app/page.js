"use client";

import { useState, useEffect } from "react";
import TransactionForm from "./client/components/TransactionForm";
import TransactionList from "./client/components/TransactionList";
import MonthlyBarChart from "./client/components/MonthlyBarChart";
import BudgetForm from "./client/components/BudgetForm";
import BudgetChart from "./client/components/BudgetChart";
import SpendingInsights from "./client/components/SpendingInsights";

export default function Home() {
  const [transactions, setTransactions] = useState(null);
  const [budgets, setBudgets] = useState(null);
  const [error, setError] = useState("");
  const [editingTxn, setEditingTxn] = useState(null);

  const categories = [
    "Food",
    "Housing",
    "Transport",
    "Entertainment",
    "Uncategorized",
  ];

  useEffect(() => {
    async function loadData() {
      try {
        setError("");
        const [txRes, bdRes] = await Promise.all([
          fetch("/api/transactions"),
          fetch("/api/budgets"),
        ]);
        if (!txRes.ok) throw new Error("Could not load transactions");
        if (!bdRes.ok) throw new Error("Could not load budgets");

        const txData = await txRes.json();
        const bdData = await bdRes.json();

        setTransactions(txData.map((t) => ({ ...t, id: t._id || t.id })));

        // turn budget array into map
        const map = {};
        bdData.forEach((b) => {
          map[b.category] = { ...b, id: b._id || b.id };
        });
        setBudgets(map);
      } catch (err) {
        setError(err.message);
      }
    }
    loadData();
  }, []);

  // Compute expenses by category
  const expenses = {};
  if (transactions) {
    transactions.forEach((t) => {
      const c = t.category || "Uncategorized";
      expenses[c] = (expenses[c] || 0) + t.amount;
    });
  }

  // Handlers
  const handleAdd = async (txn) => {
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(txn),
      });
      if (!res.ok) throw new Error("Add failed");
      const newTxn = await res.json();
      setTransactions((prev) => [
        { ...newTxn, id: newTxn._id || newTxn.id },
        ...prev,
      ]);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdate = async (txn) => {
    try {
      const res = await fetch(`/api/transactions/${txn.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(txn),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === (updated._id || updated.id)
            ? { ...updated, id: updated._id || updated.id }
            : t
        )
      );
      setEditingTxn(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      if (editingTxn?.id === id) setEditingTxn(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBudgetUpdate = async (category, amount) => {
    try {
      const res = await fetch(`/api/budgets/${encodeURIComponent(category)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) throw new Error("Budget update failed");
      const updated = await res.json();
      setBudgets((prev) => ({
        ...prev,
        [category]: { ...updated, id: updated._id || updated.id },
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) {
    return (
      <div className="data-card">
        <h2 className="card-title">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="text-2xl font-bold">💰 Personal Finance Dashboard</h1>
        </div>
      </header>

      {/* Main Grid */}
      <main className="dashboard-container">
        {/* Left Column: Transactions */}
        <section className="space-y-6">
          <div className="data-card">
            <h2 className="card-title">➕ Add / Edit Transaction</h2>
            {transactions ? (
              <TransactionForm
                categories={categories}
                onAdd={handleAdd}
                onUpdate={handleUpdate}
                onCancel={() => setEditingTxn(null)}
                editingTxn={editingTxn}
              />
            ) : (
              <p>Loading form…</p>
            )}
          </div>

          <div className="data-card">
            <h2 className="card-title">📋 Recent Transactions</h2>
            {transactions ? (
              <TransactionList
                transactions={transactions}
                onEdit={(t) => setEditingTxn(t)}
                onDelete={handleDelete}
              />
            ) : (
              <p>Loading transactions…</p>
            )}
          </div>
        </section>

        {/* Right Column: Dashboard */}
        <section className="space-y-6">
          {/* Spending Insights */}
          <div className="data-card">
            <h2 className="card-title">📊 Spending Summary</h2>
            {transactions && budgets ? (
              <SpendingInsights
                transactions={transactions}
                budgets={budgets}
                categories={categories}
              />
            ) : (
              <p>Loading summary…</p>
            )}
          </div>

          {/* Budget Form */}
          <div className="data-card">
            <h2 className="card-title">📈 Set Budgets</h2>
            {budgets ? (
              <BudgetForm
                categories={categories}
                budgets={budgets}
                onBudgetUpdate={handleBudgetUpdate}
              />
            ) : (
              <p>Loading budgets…</p>
            )}
          </div>

          {/* Charts */}
          <div className="data-card">
            <h2 className="card-title">📉 Charts</h2>
            {transactions && budgets ? (
              <>
                <MonthlyBarChart transactions={transactions} />
                <BudgetChart
                  budgets={budgets}
                  expenses={expenses}
                  categories={categories}
                />
              </>
            ) : (
              <p>Loading charts…</p>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-subtext border-t border-border">
        © {new Date().getFullYear()} Finance Tracker
      </footer>
    </div>
  );
}
