"use client"
import { useState, useEffect } from "react"
import { setBudget, getBudget } from "@/lib/firestore"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import FeedbackMessage from "@/components/FeedbackMessage"

export default function BudgetSettings() {
  const [overall, setOverall] = useState<number>(0)
  const [categories, setCategories] = useState<{ [key: string]: number }>({})
  const [feedback, setFeedback] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [categoryBudget, setCategoryBudget] = useState<number>(0)

  const defaultCategories = [
    "Food",
    "Transportation",
    "Housing",
    "Shopping",
    "Healthcare",
    "Utilities",
    "Entertainment",
  ]

  useEffect(() => {
    async function fetchBudget() {
      setLoading(true)
      try {
        const budgetData = await getBudget()
        setOverall(budgetData.overall)
        setCategories(budgetData.categories)
      } catch (error) {
        console.error("Error fetching budget:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBudget()
  }, [])

  const handleSubmitOverall = async () => {
    setSaving(true)
    try {
      await setBudget({ overall, categories })
      setFeedback("Overall budget updated successfully!")
    } catch (error) {
      setFeedback("Failed to update overall budget.")
    } finally {
      setSaving(false)
    }
  }

  const handleAddCategoryBudget = () => {
    if (selectedCategory && categoryBudget >= 0) {
      setCategories((prev) => ({
        ...prev,
        [selectedCategory]: categoryBudget,
      }))
      setSelectedCategory("")
      setCategoryBudget(0)
    }
  }

  const handleSaveAllBudgets = async () => {
    setSaving(true)
    try {
      await setBudget({ overall, categories })
      setFeedback("All budgets updated successfully!")
    } catch (error) {
      setFeedback("Failed to update budgets.")
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveCategory = (category: string) => {
    const newCategories = { ...categories }
    delete newCategories[category]
    setCategories(newCategories)
  }

  // Filter out categories that already have a budget
  const availableCategories = defaultCategories.filter((category) => !Object.keys(categories).includes(category))

  return (
    <div className="container mx-auto p-4 md:p-6 pt-20 md:pt-8 pb-20">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Budget Settings</h1>
      </div>

      {feedback && (
        <FeedbackMessage
          message={feedback}
          type={feedback.includes("success") ? "success" : "warning"}
          onClose={() => setFeedback(null)}
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Overall Monthly Budget</CardTitle>
              <CardDescription>Set your total spending limit for the month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="overall">Monthly Budget (₹)</Label>
                  <Input
                    id="overall"
                    type="number"
                    value={overall || ""}
                    onChange={(e) => setOverall(Number(e.target.value))}
                    min="0"
                    step="100"
                    placeholder="Enter your monthly budget"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmitOverall} disabled={saving} className="w-full">
                {saving ? (
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
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    Save Overall Budget
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Budgets</CardTitle>
              <CardDescription>Set spending limits for specific categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                      disabled={availableCategories.length === 0}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories.length > 0 ? (
                          availableCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            All categories have budgets
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Amount (₹)</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="budget"
                        type="number"
                        value={categoryBudget || ""}
                        onChange={(e) => setCategoryBudget(Number(e.target.value))}
                        min="0"
                        step="100"
                        placeholder="Amount"
                        disabled={!selectedCategory}
                      />
                      <Button
                        onClick={handleAddCategoryBudget}
                        disabled={!selectedCategory || categoryBudget <= 0}
                        size="icon"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Current Category Budgets</h3>
                  {Object.keys(categories).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(categories).map(([category, amount]) => (
                        <div
                          key={category}
                          className="flex items-center justify-between p-3 border border-border rounded-lg"
                        >
                          <span>{category}</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">₹{amount.toLocaleString()}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveCategory(category)}
                              className="h-8 w-8 text-destructive hover:text-destructive/80"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 border border-dashed border-border rounded-lg">
                      <p className="text-muted-foreground">No category budgets set</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveAllBudgets} disabled={saving} className="w-full">
                {saving ? (
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
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    Save All Budgets
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
