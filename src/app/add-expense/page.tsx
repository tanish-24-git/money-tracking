"use client"
import { useState } from "react"
import type React from "react"
import { PlusCircle } from "lucide-react"

import { addExpense } from "@/lib/firestore"
import type { Expense } from "@/types"
import FeedbackMessage from "@/components/ui/feedback-message"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AddExpense() {
  const [form, setForm] = useState<Expense>({
    date: new Date().toISOString().slice(0, 10),
    amount: 0,
    category: "Food",
    description: "",
  })
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = ["Food", "Transportation", "Housing", "Shopping", "Healthcare", "Utilities", "Entertainment"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.amount <= 0) {
      setFeedback("Amount must be greater than zero.")
      return
    }

    setIsSubmitting(true)
    try {
      await addExpense({ ...form, amount: Number(form.amount) })
      setFeedback("Expense added successfully!")
      setForm({
        date: new Date().toISOString().slice(0, 10),
        amount: 0,
        category: "Food",
        description: "",
      })
    } catch (error) {
      setFeedback("Failed to add expense.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Add Expense</h2>
      </div>

      {feedback && (
        <FeedbackMessage
          message={feedback}
          type={feedback.includes("success") ? "success" : "warning"}
          onClose={() => setFeedback(null)}
        />
      )}

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>New Expense</CardTitle>
            <CardDescription>Record your spending</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={form.amount || ""}
                  onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  placeholder="What did you spend on?"
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Expense
                  </span>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="hidden md:block">
          <Card className="h-full bg-gradient-to-br from-primary/20 to-primary/5 border-0">
            <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <PlusCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Your Spending</h3>
              <p className="text-muted-foreground mb-6">
                Recording your expenses is the first step toward financial awareness and control.
              </p>
              <div className="space-y-4 text-sm text-left w-full">
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-primary font-bold text-xs">1</span>
                  </div>
                  <p>Enter the amount and date of your expense</p>
                </div>
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-primary font-bold text-xs">2</span>
                  </div>
                  <p>Select the appropriate category</p>
                </div>
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-primary font-bold text-xs">3</span>
                  </div>
                  <p>Add a description to remember what you spent on</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
