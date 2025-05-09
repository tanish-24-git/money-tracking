"use client"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import type { Expense } from "@/types"
import { format, parseISO, subDays } from "date-fns"
import { useTheme } from "next-themes"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

interface DailyChartProps {
  expenses: Expense[]
}

export default function DailyChart({ expenses }: DailyChartProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  // Get last 14 days
  const today = new Date()
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(today, 13 - i)
    return format(date, "yyyy-MM-dd")
  })

  // Prepare data for each date
  const dailyData = dates.reduce(
    (acc, date) => {
      acc[date] = 0
      return acc
    },
    {} as { [key: string]: number },
  )

  // Fill in actual expense data
  expenses.forEach((exp) => {
    if (dailyData.hasOwnProperty(exp.date)) {
      dailyData[exp.date] += exp.amount
    }
  })

  const chartData = {
    labels: dates.map((date) => format(parseISO(date), "MMM dd")),
    datasets: [
      {
        label: "Daily Expenses (₹)",
        data: dates.map((date) => dailyData[date]),
        borderColor: "hsl(var(--primary))",
        backgroundColor: isDark ? "hsla(var(--primary), 0.2)" : "hsla(var(--primary), 0.1)",
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "hsl(var(--primary))",
        pointBorderColor: isDark ? "hsl(var(--background))" : "hsl(var(--background))",
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? "hsl(var(--card))" : "hsl(var(--card))",
        titleColor: isDark ? "hsl(var(--foreground))" : "hsl(var(--foreground))",
        bodyColor: isDark ? "hsl(var(--foreground))" : "hsl(var(--foreground))",
        borderColor: "hsla(var(--primary), 0.3)",
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (context: any) => `₹${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: isDark ? "hsla(var(--foreground), 0.6)" : "hsla(var(--foreground), 0.6)",
        },
      },
      y: {
        grid: {
          color: isDark ? "hsla(var(--foreground), 0.1)" : "hsla(var(--foreground), 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: isDark ? "hsla(var(--foreground), 0.6)" : "hsla(var(--foreground), 0.6)",
          callback: (value: any) => "₹" + value,
        },
        beginAtZero: true,
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    elements: {
      line: {
        borderJoinStyle: "round" as const,
      },
    },
  }

  return (
    <div className="w-full h-full">
      <Line data={chartData} options={options} />
    </div>
  )
}
