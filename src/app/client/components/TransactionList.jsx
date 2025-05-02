"use client";

import React from "react";

export default function TransactionList({
  transactions = [],
  onDelete,
  onEdit,
}) {
  if (transactions.length === 0) {
    return <div className="data-card">No transactions yet.</div>;
  }

  return (
    <div>
      {transactions.map((txn) => (
        <div key={txn.id} className="transaction-item">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-text truncate">
              {txn.description}
            </h3>
            <p className="text-sm text-subtext mt-1">
              {new Date(txn.date).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-4 ml-4">
            <span
              className={
                txn.amount >= 0 ? "amount-positive" : "amount-negative"
              }
            >
              ₹{Math.abs(txn.amount).toFixed(2)}
            </span>
            <div className="flex gap-2">
              <button onClick={() => onEdit(txn)} className="btn-secondary">
                Edit
              </button>
              <button
                onClick={() => onDelete(txn.id)}
                className="btn-secondary"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
