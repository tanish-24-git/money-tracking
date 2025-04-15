import Link from "next/link"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface BudgetAlertsProps {
  warnings: string[]
}

export function BudgetAlerts({ warnings }: BudgetAlertsProps) {
  if (warnings.length === 0) return null

  return (
    <Card className="border-destructive/50 bg-destructive/5">
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
  )
}
