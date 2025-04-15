import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DailyChart from "@/components/charts/daily-chart"
import PieChart from "@/components/charts/pie-chart"
import type { Expense } from "@/types"

interface ExpenseChartsProps {
  expenses: Expense[]
}

export function ExpenseCharts({ expenses }: ExpenseChartsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:w-auto">
        <TabsTrigger value="overview">Daily Trends</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Spending Trends</CardTitle>
            <CardDescription>Your daily expense pattern</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <DailyChart expenses={expenses} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="categories" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Spending by category</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <PieChart expenses={expenses} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
