import { format } from "date-fns"
import { Wallet } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Expense } from "@/types"

interface RecentTransactionsProps {
  transactions: Expense[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest expenses</CardDescription>
        </div>
        <Link href="/history">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3"
              >
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
        <Link href="/add-expense" className="w-full">
          <Button className="w-full">Add New Expense</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
