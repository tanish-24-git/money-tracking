"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, Clock, Home, PlusCircle, Wallet } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/layout/mode-toggle"

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border/50">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
            <Wallet className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold">FinanceAI</span>
            <span className="text-xs text-muted-foreground">Smart Money Tracker</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav />
      </SidebarContent>
      <SidebarFooter className="border-t border-border/50 p-4">
        <ModeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}

function SidebarNav() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  const navItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Add Expense",
      href: "/add-expense",
      icon: <PlusCircle className="h-5 w-5" />,
    },
    {
      title: "Budget",
      href: "/budget",
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      title: "Statistics",
      href: "/statistics",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      title: "History",
      href: "/history",
      icon: <Clock className="h-5 w-5" />,
    },
  ]

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton asChild isActive={pathname === item.href} onClick={() => setOpenMobile(false)}>
            <Link href={item.href}>
              {item.icon}
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

export function MobileSidebarTrigger() {
  return (
    <div className="flex items-center md:hidden">
      <SidebarTrigger />
    </div>
  )
}
