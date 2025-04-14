import { db } from './firebase';
import { collection, addDoc, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { Expense, Budget } from '../types';

// Add an expense
export async function addExpense(expense: Expense): Promise<string> {
  const docRef = await addDoc(collection(db, 'expenses'), expense);
  return docRef.id;
}

// Get all expenses
export async function getExpenses(): Promise<Expense[]> {
  const querySnapshot = await getDocs(collection(db, 'expenses'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
}

// Set budget (overall and categories)
export async function setBudget(budget: Budget): Promise<void> {
  await setDoc(doc(db, 'budgets', 'main'), budget);
}

// Get budget
export async function getBudget(): Promise<Budget> {
  const docRef = doc(db, 'budgets', 'main');
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as Budget) : { overall: 0, categories: {} };
}