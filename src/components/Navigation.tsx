"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PlusCircle, BarChart2, Clock, Wallet, Menu, X, Moon, Sun } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const navItems = [
    { href: "/", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    { href: "/add-expense", label: "Add Expense", icon: <PlusCircle className="h-5 w-5" /> },
    { href: "/statistics", label: "Statistics", icon: <BarChart2 className="h-5 w-5" /> },
    { href: "/history", label: "History", icon: <Clock className="h-5 w-5" /> },
    { href: "/budget", label: "Budget", icon: <Wallet className="h-5 w-5" /> },
  ]

  return (
    <>
      {/* Mobile Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">ExpenseAI</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="md:hidden rounded-full">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-14 left-0 right-0 bg-background border-b border-border">
            <div className="container mx-auto px-4 py-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                  <div
                    className={cn(
                      "flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors",
                      pathname === item.href ? "bg-primary/10 text-primary" : "hover:bg-muted",
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-background/80 backdrop-blur-md flex-col z-40">
        <div className="p-4 flex items-center space-x-2">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl">ExpenseAI</span>
        </div>

        <div className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                  pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <Button variant="outline" onClick={toggleTheme} className="w-full justify-start">
            {theme === "dark" ? (
              <>
                <Sun className="h-4 w-4 mr-2" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 mr-2" />
                Dark Mode
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Content Padding */}
      <div className="md:pl-64 pt-14">{/* This is where the main content will go */}</div>
    </>
  )
}
