'use client';
import { useState } from 'react';

interface BudgetFormProps {
  onSubmitOverall: (overall: number) => void;
  onSubmitCategories: (categories: { [key: string]: number }) => void;
  initialBudget?: { overall: number; categories: { [key: string]: number } };
}

export default function BudgetForm({
  onSubmitOverall,
  onSubmitCategories,
  initialBudget = { overall: 0, categories: {} },
}: BudgetFormProps) {
  const [overall, setOverall] = useState(initialBudget.overall);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categoryBudget, setCategoryBudget] = useState<number>(0);
  const [categories, setCategories] = useState<{ [key: string]: number }>(initialBudget.categories);

  const defaultCategories = [
    'Food',
    'Transportation',
    'Housing',
    'Shopping',
    'Healthcare',
    'Utilities',
    'Entertainment',
  ];

  const handleSubmitOverall = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitOverall(overall);
  };

  const handleSubmitCategories = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory && categoryBudget >= 0) {
      setCategories(prev => ({
        ...prev,
        [selectedCategory]: categoryBudget,
      }));
    }
    onSubmitCategories(categories);
    // Reset fields after submission
    setSelectedCategory('');
    setCategoryBudget(0);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmitOverall}>
        <div>
          <label className="block">Overall Monthly Budget (₹)</label>
          <input
            type="number"
            value={overall}
            onChange={e => setOverall(Number(e.target.value))}
            className="w-full p-2 border rounded"
            min="0"
            step="0.01"
          />
        </div>
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Overall Budget
        </button>
      </form>
      <h3 className="text-xl">Category Budgets (₹)</h3>
      <form onSubmit={handleSubmitCategories}>
        <div>
          <label className="block">Select Category</label>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="" disabled>Select a category</option>
            {defaultCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block">Budget Limit (₹)</label>
          <input
            type="number"
            value={categoryBudget}
            onChange={e => setCategoryBudget(Number(e.target.value) || 0)}
            className="w-full p-2 border rounded"
            min="0"
            step="0.01"
            disabled={!selectedCategory}
          />
        </div>
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={!selectedCategory}
        >
          Save Budget
        </button>
      </form>
    </div>
  );
}