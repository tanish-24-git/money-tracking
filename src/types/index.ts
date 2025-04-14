export interface Expense {
  id?: string;
  date: string;
  amount: number;
  category: string;
  description: string;
}

export interface Budget {
  overall: number;
  categories: { [key: string]: number };
}