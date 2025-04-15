"use client"

import Link from "next/link"
import { PlusCircle, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MobileSidebarTrigger } from "@/components/layout/sidebar"
import { ModeToggle } from "@/components/layout/mode-toggle"

interface DashboardHeaderProps {
  title: string
  description?: string
  showAddExpenseButton?: boolean
}

export function DashboardHeader({ title, description, showAddExpenseButton = false }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 md:hidden">
        <MobileSidebarTrigger />
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">FinanceAI</span>
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {showAddExpenseButton && (
            <Button asChild size="sm" className="hidden md:flex">
              <Link href="/add-expense">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
              </Link>
            </Button>
          )}
          <div className="md:hidden">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
