"use client"
import { useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { X, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FeedbackMessageProps {
  message: string
  type: "success" | "warning"
  onClose: () => void
}

export default function FeedbackMessage({ message, type, onClose }: FeedbackMessageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <Alert
      className={`fixed top-4 right-4 w-full max-w-md z-50 shadow-lg animate-in slide-in-from-right-5 duration-300 ${
        type === "success" ? "border-green-500" : "border-destructive"
      }`}
      variant="default"
    >
      <div className="flex items-start">
        {type === "success" ? (
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
        ) : (
          <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5" />
        )}
        <div className="flex-1">
          <AlertTitle className={type === "success" ? "text-green-500" : "text-destructive"}>
            {type === "success" ? "Success" : "Warning"}
          </AlertTitle>
          <AlertDescription className="text-sm mt-1">{message}</AlertDescription>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full -mt-1 -mr-1" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  )
}
