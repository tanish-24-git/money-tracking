"use client"
import { useState, useEffect } from "react"
import { getExpenses, getBudget } from "@/lib/firestore"
import type { Expense, Budget } from "@/types"

import { OverviewCards } from "@/components/dashboard/overview-cards"
import { BudgetAlerts } from "@/components/dashboard/budget-alerts"
import { ExpenseCharts } from "@/components/dashboard/expense-charts"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import WorkflowSteps from "@/components/dashboard/workflow-steps"

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budget, setBudget] = useState<Budget>({ overall: 0, categories: {} })
  const [warnings, setWarnings] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [totalSpent, setTotalSpent] = useState(0)
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const expensesData = await getExpenses()
        const budgetData = await getBudget()

        setExpenses(expensesData)
        setBudget(budgetData)

        // Calculate total spent this month
        const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
        const monthlyExpenses = expensesData.filter((exp) => exp.date.startsWith(currentMonth))
        const total = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0)
        setTotalSpent(total)

        // Get recent expenses
        const sorted = [...expensesData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setRecentExpenses(sorted.slice(0, 5))

        // Check for budget exceedances
        const newWarnings: string[] = []
        if (budgetData.overall > 0 && total > budgetData.overall) {
          newWarnings.push(`Overall monthly budget (₹${budgetData.overall}) exceeded! Spent: ₹${total}`)
        }

        const categoryTotals: { [key: string]: number } = {}
        monthlyExpenses.forEach((exp) => {
          categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount
        })

        Object.entries(budgetData.categories).forEach(([category, limit]) => {
          if (limit > 0 && categoryTotals[category] > limit) {
            newWarnings.push(`${category} budget (₹${limit}) exceeded! Spent: ₹${categoryTotals[category]}`)
          }
        })

        setWarnings(newWarnings)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get today's expenses
  const today = new Date().toISOString().slice(0, 10)
  const todayExpenses = expenses.filter((exp) => exp.date === today)
  const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  // Calculate category totals for pie chart
  const categoryTotals = expenses.reduce(
    (acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount
      return acc
    },
    {} as { [key: string]: number },
  )

  // Get top spending category
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0] || ["None", 0]

  if (loading) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading your financial data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Financial Dashboard</h2>
      </div>

      <OverviewCards
        budget={budget.overall}
        totalSpent={totalSpent}
        todayTotal={todayTotal}
        topCategory={topCategory}
      />

      {warnings.length > 0 && <BudgetAlerts warnings={warnings} />}

      <div>
        <h3 className="mb-4 text-lg font-medium">Get Started with FinanceAI</h3>
        <WorkflowSteps />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ExpenseCharts expenses={expenses} />
        <RecentTransactions transactions={recentExpenses} />
      </div>
    </div>
  )
}
