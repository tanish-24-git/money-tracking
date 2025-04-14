"use client"
import { useState, useEffect } from "react"
import { getExpenses, getBudget } from "@/lib/firestore"
import type { Expense, Budget } from "@/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, ArrowDownRight, Wallet, PlusCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import DailyChart from "@/components/DailyChart"
import PieChart from "@/components/PieChart"
import WorkflowSteps from "@/components/WorkflowSteps"
import { format } from "date-fns"

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

  // Calculate budget percentage
  const budgetPercentage = budget.overall > 0 ? Math.min(Math.round((totalSpent / budget.overall) * 100), 100) : 0

  // Get today's expenses
  const today = new Date().toISOString().slice(0, 10)
  const todayExpenses = expenses.filter((exp) => exp.date === today)
  const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div className="container mx-auto p-4 md:p-6 pt-20 md:pt-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Financial Dashboard</h1>
          <p className="text-muted-foreground">Track, analyze, and optimize your expenses</p>
        </div>
        <Link href="/add-expense">
          <Button className="mt-4 md:mt-0">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Expense
          </Button>
        </Link>
      </div>

      {/* Workflow Steps */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Get Started with ExpenseAI</h2>
        <WorkflowSteps />
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Budget</CardTitle>
            <CardDescription className="text-2xl font-bold">₹{budget.overall.toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Spent: ₹{totalSpent.toLocaleString()}</span>
                <span className={budgetPercentage >= 90 ? "text-destructive" : "text-muted-foreground"}>
                  {budgetPercentage}%
                </span>
              </div>
              <Progress value={budgetPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Spending</CardTitle>
            <CardDescription className="text-2xl font-bold">₹{todayTotal.toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              <ArrowUpRight className="mr-1 h-4 w-4 text-destructive" />
              <span className="text-destructive">+₹{todayTotal.toLocaleString()}</span>
              <span className="ml-1 text-muted-foreground">today</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Remaining Budget</CardTitle>
            <CardDescription className="text-2xl font-bold">
              ₹{Math.max(0, budget.overall - totalSpent).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              {budget.overall - totalSpent > 0 ? (
                <>
                  <ArrowDownRight className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500">On track</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="mr-1 h-4 w-4 text-destructive" />
                  <span className="text-destructive">Budget exceeded</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <Card className="mb-8 border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
              Budget Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {warnings.map((warning, index) => (
                <li key={index} className="text-sm flex items-start">
                  <span className="mr-2">•</span>
                  {warning}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/budget">
              <Button variant="outline" size="sm">
                Adjust Budget
              </Button>
            </Link>
          </CardFooter>
        </Card>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Spending Trends</CardTitle>
            <CardDescription>Your daily expense pattern</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <DailyChart expenses={expenses} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Spending by category</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <PieChart expenses={expenses} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <Wallet className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {expense.category} • {format(new Date(expense.date), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">₹{expense.amount.toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No recent transactions found</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/history">
            <Button variant="outline">View All Transactions</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
