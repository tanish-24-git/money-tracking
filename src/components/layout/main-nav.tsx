"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, CreditCard, Home, Menu, PlusCircle, Wallet } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/layout/mode-toggle"

export function MainNav() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Wallet className="h-6 w-6 text-primary" />
        <span className="hidden font-bold sm:inline-block">FinanceAI</span>
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/" ? "text-foreground font-medium" : "text-foreground/60",
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/add-expense"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/add-expense") ? "text-foreground font-medium" : "text-foreground/60",
          )}
        >
          Add Expense
        </Link>
        <Link
          href="/budget"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/budget") ? "text-foreground font-medium" : "text-foreground/60",
          )}
        >
          Budget
        </Link>
        <Link
          href="/statistics"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/statistics") ? "text-foreground font-medium" : "text-foreground/60",
          )}
        >
          Statistics
        </Link>
        <Link
          href="/history"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/history") ? "text-foreground font-medium" : "text-foreground/60",
          )}
        >
          History
        </Link>
      </nav>
    </div>
  )
}

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: <Home className="mr-2 h-4 w-4" />,
      active: pathname === "/",
    },
    {
      href: "/add-expense",
      label: "Add Expense",
      icon: <PlusCircle className="mr-2 h-4 w-4" />,
      active: pathname === "/add-expense",
    },
    {
      href: "/budget",
      label: "Budget",
      icon: <Wallet className="mr-2 h-4 w-4" />,
      active: pathname === "/budget",
    },
    {
      href: "/statistics",
      label: "Statistics",
      icon: <BarChart2 className="mr-2 h-4 w-4" />,
      active: pathname === "/statistics",
    },
    {
      href: "/history",
      label: "History",
      icon: <CreditCard className="mr-2 h-4 w-4" />,
      active: pathname === "/history",
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-primary" />
          <span className="font-bold">FinanceAI</span>
        </div>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-foreground",
                  route.active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
          </div>
        </ScrollArea>
        <div className="absolute bottom-4 left-4">
          <ModeToggle />
        </div>
      </SheetContent>
    </Sheet>
  )
}
