import { ArrowUpRight, TrendingDown, TrendingUp, Wallet } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface OverviewCardsProps {
  budget: number
  totalSpent: number
  todayTotal: number
  topCategory: [string, number]
}

export function OverviewCards({ budget, totalSpent, todayTotal, topCategory }: OverviewCardsProps) {
  // Calculate budget percentage
  const budgetPercentage = budget > 0 ? Math.min(Math.round((totalSpent / budget) * 100), 100) : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{budget.toLocaleString()}</div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span>Spent: ₹{totalSpent.toLocaleString()}</span>
              <span className={budgetPercentage >= 90 ? "text-destructive" : "text-muted-foreground"}>
                {budgetPercentage}%
              </span>
            </div>
            <Progress value={budgetPercentage} className="h-1" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Spending</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{todayTotal.toLocaleString()}</div>
          <div className="mt-4 flex items-center text-xs">
            <ArrowUpRight className="mr-1 h-4 w-4 text-destructive" />
            <span className="text-destructive">+₹{todayTotal.toLocaleString()}</span>
            <span className="ml-1 text-muted-foreground">today</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{Math.max(0, budget - totalSpent).toLocaleString()}</div>
          <div className="mt-4 flex items-center text-xs">
            {budget - totalSpent > 0 ? (
              <>
                <TrendingDown className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500">On track</span>
              </>
            ) : (
              <>
                <TrendingUp className="mr-1 h-4 w-4 text-destructive" />
                <span className="text-destructive">Budget exceeded</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Spending</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topCategory[0]}</div>
          <div className="mt-4 flex items-center text-xs">
            <TrendingUp className="mr-1 h-4 w-4 text-primary" />
            <span className="text-primary">₹{topCategory[1].toLocaleString()}</span>
            <span className="ml-1 text-muted-foreground">highest category</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
