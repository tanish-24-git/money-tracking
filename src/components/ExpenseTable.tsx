'use client';
import { Expense } from '../types';

interface ExpenseTableProps {
  expenses: Expense[];
}

export default function ExpenseTable({ expenses }: ExpenseTableProps) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">Date</th>
          <th className="border p-2">Amount (₹)</th>
          <th className="border p-2">Category</th>
          <th className="border p-2">Description</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map(exp => (
          <tr key={exp.id}>
            <td className="border p-2">{exp.date}</td>
            <td className="border p-2">₹{exp.amount.toFixed(2)}</td>
            <td className="border p-2">{exp.category}</td>
            <td className="border p-2">{exp.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}