import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { MainNav, MobileNav } from "@/components/layout/main-nav"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { UserNav } from "@/components/layout/user-nav"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <MobileNav />
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link
              href="/add-expense"
              className={cn(buttonVariants({ variant: "default", size: "sm" }), "hidden md:flex")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Expense
            </Link>
            <ModeToggle />
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  )
}
