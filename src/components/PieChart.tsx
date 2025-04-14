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
  const { theme } = useTheme()
  const isDark = theme === "dark"

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
    "rgba(147, 51, 234, 1)", // Purple
    "rgba(59, 130, 246, 1)", // Blue
    "rgba(16, 185, 129, 1)", // Green
    "rgba(245, 158, 11, 1)", // Amber
    "rgba(239, 68, 68, 1)", // Red
    "rgba(14, 165, 233, 1)", // Sky
    "rgba(249, 115, 22, 1)", // Orange
  ]

  const chartData = {
    labels: sortedCategories,
    datasets: [
      {
        data: sortedCategories.map((category) => categoryData[category]),
        backgroundColor: sortedCategories.map((_, index) => categoryColors[index % categoryColors.length]),
        borderColor: isDark ? "rgba(30, 30, 47, 1)" : "rgba(255, 255, 255, 1)",
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
          color: isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)",
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
        backgroundColor: isDark ? "rgba(30, 30, 47, 0.8)" : "rgba(255, 255, 255, 0.8)",
        titleColor: isDark ? "#fff" : "#000",
        bodyColor: isDark ? "#fff" : "#000",
        borderColor: "rgba(147, 51, 234, 0.3)",
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
