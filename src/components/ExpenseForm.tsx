'use client';
import { useState } from 'react';

interface ExpenseFormProps {
  onSubmit: (expense: { date: string; amount: number; category: string; description: string }) => void;
}

export default function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    amount: 0,
    category: 'Food',
    description: '',
  });

  const categories = ['Food', 'Transportation', 'Housing', 'Shopping', 'Healthcare', 'Utilities', 'Entertainment'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...form, amount: Number(form.amount) });
    setForm({ date: new Date().toISOString().slice(0, 10), amount: 0, category: 'Food', description: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Date</label>
        <input
          type="date"
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block">Amount (₹)</label>
        <input
          type="number"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
          className="w-full p-2 border rounded"
          required
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label className="block">Category</label>
        <select
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
          className="w-full p-2 border rounded"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block">Description</label>
        <input
          type="text"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Add Expense
      </button>
    </form>
  );
}