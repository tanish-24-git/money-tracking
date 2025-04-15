"use client"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, BarChart2, Wallet, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function WorkflowSteps() {
  const steps = [
    {
      icon: <PlusCircle className="h-6 w-6" />,
      title: "Record Expenses",
      description: "Add your daily expenses with categories",
      href: "/add-expense",
      color: "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400",
    },
    {
      icon: <Wallet className="h-6 w-6" />,
      title: "Set Budgets",
      description: "Create monthly budgets for categories",
      href: "/budget",
      color: "bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400",
    },
    {
      icon: <BarChart2 className="h-6 w-6" />,
      title: "Analyze Spending",
      description: "View charts and spending patterns",
      href: "/statistics",
      color: "bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Track Progress",
      description: "Monitor your financial goals",
      href: "/history",
      color: "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {steps.map((step, index) => (
        <Link key={index} href={step.href} className="block">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-border/40">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center mb-4`}>
                  {step.icon}
                </div>
                <h3 className="font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                <div className="mt-4 text-sm text-primary font-medium">Step {index + 1}</div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
