"use client"
import { useState, useEffect } from "react"
import { getExpenses, getBudget } from "@/lib/firestore"
import type { Expense, Budget } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, parseISO, startOfMonth, endOfMonth, subMonths } from "date-fns"
import DailyChart from "@/components/DailyChart"
import PieChart from "@/components/PieChart"
import { ArrowLeft, TrendingUp, PieChartIcon, BarChart2, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Statistics() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budget, setBudget] = useState<Budget>({ overall: 0, categories: {} })
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const expensesData = await getExpenses()
        const budgetData = await getBudget()
        setExpenses(expensesData)
        setBudget(budgetData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    // Filter expenses for selected month
    const start = startOfMonth(selectedMonth)
    const end = endOfMonth(selectedMonth)

    const filtered = expenses.filter((exp) => {
      const expDate = parseISO(exp.date)
      return expDate >= start && expDate <= end
    })

    setFilteredExpenses(filtered)
  }, [expenses, selectedMonth])

  // Calculate total for current month
  const totalSpent = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  // Calculate category totals
  const categoryTotals = filteredExpenses.reduce(
    (acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount
      return acc
    },
    {} as { [key: string]: number },
  )

  // Get previous month for comparison
  const previousMonth = subMonths(selectedMonth, 1)
  const previousMonthStart = startOfMonth(previousMonth)
  const previousMonthEnd = endOfMonth(previousMonth)

  const previousMonthExpenses = expenses.filter((exp) => {
    const expDate = parseISO(exp.date)
    return expDate >= previousMonthStart && expDate <= previousMonthEnd
  })

  const previousMonthTotal = previousMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  // Calculate percentage change
  const percentageChange =
    previousMonthTotal === 0 ? 100 : Math.round(((totalSpent - previousMonthTotal) / previousMonthTotal) * 100)

  return (
    <div className="container mx-auto p-4 md:p-6 pt-20 md:pt-8 pb-20">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Statistics</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spending</CardTitle>
            <CardDescription className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              {percentageChange > 0 ? (
                <>
                  <TrendingUp className="mr-1 h-4 w-4 text-destructive" />
                  <span className="text-destructive">+{percentageChange}%</span>
                </>
              ) : (
                <>
                  <TrendingUp className="mr-1 h-4 w-4 text-green-500 transform rotate-180" />
                  <span className="text-green-500">{percentageChange}%</span>
                </>
              )}
              <span className="ml-1 text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Budget Utilization</CardTitle>
            <CardDescription className="text-2xl font-bold">
              {budget.overall > 0
                ? `${Math.min(Math.round((totalSpent / budget.overall) * 100), 100)}%`
                : "No budget set"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              <span className="text-muted-foreground">
                {budget.overall > 0
                  ? `₹${totalSpent.toLocaleString()} of ₹${budget.overall.toLocaleString()}`
                  : "Set a budget in Budget Settings"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Month</CardTitle>
            <CardDescription className="text-2xl font-bold">{format(selectedMonth, "MMMM yyyy")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedMonth(new Date())}>
                Current
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">
            <BarChart2 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="categories">
            <PieChartIcon className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="daily">
            <Calendar className="h-4 w-4 mr-2" />
            Daily
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Spending Trends</CardTitle>
                <CardDescription>Your daily expense pattern</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <DailyChart expenses={filteredExpenses} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Spending by category</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <PieChart expenses={filteredExpenses} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Category Analysis</CardTitle>
              <CardDescription>Spending distribution across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(categoryTotals)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount]) => {
                    const percentage = Math.round((amount / totalSpent) * 100) || 0
                    const budgetForCategory = budget.categories[category] || 0
                    const isOverBudget = budgetForCategory > 0 && amount > budgetForCategory

                    return (
                      <div key={category}>
                        <div className="flex justify-between items-center mb-1">
                          <div className="font-medium">{category}</div>
                          <div className="text-sm">
                            ₹{amount.toLocaleString()}
                            {budgetForCategory > 0 && (
                              <span className={isOverBudget ? "text-destructive ml-1" : "text-muted-foreground ml-1"}>
                                / ₹{budgetForCategory.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full ${isOverBudget ? "bg-destructive" : "bg-primary"}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <div>{percentage}% of total</div>
                          {budgetForCategory > 0 && (
                            <div className={isOverBudget ? "text-destructive" : ""}>
                              {Math.round((amount / budgetForCategory) * 100)}% of budget
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Detailed view of your spending by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <PieChart expenses={filteredExpenses} />
              </div>

              <div className="mt-6 space-y-4">
                {Object.entries(categoryTotals)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount]) => {
                    const percentage = Math.round((amount / totalSpent) * 100) || 0

                    return (
                      <div
                        key={category}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                          <span className="font-medium">{category}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₹{amount.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">{percentage}% of total</div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>Daily Spending</CardTitle>
              <CardDescription>Track your expenses day by day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 mb-6">
                <DailyChart expenses={filteredExpenses} />
              </div>

              <div className="space-y-4">
                {Array.from(
                  filteredExpenses.reduce((acc, expense) => {
                    if (!acc.has(expense.date)) {
                      acc.set(expense.date, [])
                    }
                    acc.get(expense.date)!.push(expense)
                    return acc
                  }, new Map<string, Expense[]>()),
                )
                  .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                  .map(([date, dayExpenses]) => {
                    const dayTotal = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0)

                    return (
                      <div key={date} className="border border-border rounded-lg overflow-hidden">
                        <div className="bg-muted p-3 font-medium flex justify-between">
                          <span>{format(parseISO(date), "EEEE, MMMM d, yyyy")}</span>
                          <span>₹{dayTotal.toLocaleString()}</span>
                        </div>
                        <div className="divide-y divide-border">
                          {dayExpenses.map((expense, index) => (
                            <div key={index} className="p-3 flex justify-between">
                              <div>
                                <div className="font-medium">{expense.description}</div>
                                <div className="text-sm text-muted-foreground">{expense.category}</div>
                              </div>
                              <div className="font-semibold">₹{expense.amount.toLocaleString()}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
