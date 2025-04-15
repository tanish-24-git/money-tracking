"use client"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import type { Expense } from "@/types"
import { useTheme } from "next-themes"

ChartJS.register(ArcElement, Tooltip, Legend)

interface PieChartProps {
  expenses: Expense[]
}

export default function PieChart({ expenses }: PieChartProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  // Calculate category totals
  const categoryData = expenses.reduce(
    (acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount
      return acc
    },
    {} as { [key: string]: number },
  )

  // Sort categories by amount (descending)
  const sortedCategories = Object.keys(categoryData).sort((a, b) => categoryData[b] - categoryData[a])

  // Colors for categories
  const categoryColors = [
    "hsl(var(--primary))",
    "hsl(217, 91%, 60%)", // Blue
    "hsl(142, 71%, 45%)", // Green
    "hsl(43, 96%, 56%)", // Amber
    "hsl(0, 84%, 60%)", // Red
    "hsl(198, 93%, 60%)", // Sky
    "hsl(30, 95%, 60%)", // Orange
  ]

  const chartData = {
    labels: sortedCategories,
    datasets: [
      {
        data: sortedCategories.map((category) => categoryData[category]),
        backgroundColor: sortedCategories.map((_, index) => categoryColors[index % categoryColors.length]),
        borderColor: isDark ? "hsl(var(--background))" : "hsl(var(--background))",
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: isDark ? "hsla(var(--foreground), 0.8)" : "hsla(var(--foreground), 0.8)",
          padding: 15,
          font: {
            size: 12,
          },
          generateLabels: (chart: any) => {
            const data = chart.data
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const value = data.datasets[0].data[i]
                const total = data.datasets[0].data.reduce((acc: number, val: number) => acc + val, 0)
                const percentage = Math.round((value / total) * 100)

                return {
                  text: `${label}: ₹${value.toLocaleString()} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor,
                  lineWidth: 1,
                  hidden: false,
                  index: i,
                }
              })
            }
            return []
          },
        },
      },
      tooltip: {
        backgroundColor: isDark ? "hsl(var(--card))" : "hsl(var(--card))",
        titleColor: isDark ? "hsl(var(--foreground))" : "hsl(var(--foreground))",
        bodyColor: isDark ? "hsl(var(--foreground))" : "hsl(var(--foreground))",
        borderColor: "hsla(var(--primary), 0.3)",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context: any) => {
            const value = context.raw
            const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0)
            const percentage = Math.round((value / total) * 100)
            return `₹${value.toLocaleString()} (${percentage}%)`
          },
        },
      },
    },
    cutout: "60%",
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Pie data={chartData} options={options} />
    </div>
  )
}
