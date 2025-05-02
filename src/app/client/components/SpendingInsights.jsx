"use client";

export default function SpendingInsights({
  transactions,
  budgets,
  categories,
}) {
  // Compute totals only for valid and non-zero transactions
  const categoryTotals = {};

  transactions.forEach((t) => {
    if (!t || typeof t.amount !== "number" || t.amount <= 0) return;

    const category =
      typeof t.category === "string" && t.category.trim()
        ? t.category
        : "Uncategorized";

    categoryTotals[category] = (categoryTotals[category] || 0) + t.amount;
  });

  // Filter only categories with positive expenses
  const nonZeroEntries = Object.entries(categoryTotals).filter(
    ([, amount]) => amount > 0
  );

  const totalSpent = nonZeroEntries.reduce(
    (sum, [, amount]) => sum + amount,
    0
  );

  const topCategory = nonZeroEntries.length
    ? nonZeroEntries.reduce((a, b) => (b[1] > a[1] ? b : a))[0]
    : null;

  const remainingBudget = categories.reduce((sum, category) => {
    const budget = budgets[category]?.amount || 0;
    const spent = categoryTotals[category] || 0;
    return sum + (budget - spent);
  }, 0);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-lg font-semibold">Total Spent</p>
        <p>₹{totalSpent.toFixed(2)}</p>
      </div>

      <div>
        <p className="text-lg font-semibold">Top Category</p>
        {topCategory ? (
          <>
            <p>{topCategory}</p>
            <p>₹{categoryTotals[topCategory].toFixed(2)}</p>
          </>
        ) : (
          <p>N/A</p>
        )}
      </div>

      <div>
        <p className="text-lg font-semibold">Remaining Budget</p>
        <p>₹{remainingBudget.toFixed(2)}</p>
      </div>
    </div>
  );
}
