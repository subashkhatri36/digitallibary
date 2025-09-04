"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Lock, Gift } from "lucide-react"
// Database operations moved to server actions

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planId: string
  isAnnual: boolean
  userId: string
  currentTier: string
  bookId?: string
  bookPrice?: number
  isGift?: boolean
}

export function PaymentDialog({
  open,
  onOpenChange,
  planId,
  isAnnual,
  userId,
  currentTier,
  bookId,
  bookPrice,
  isGift = false,
}: PaymentDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
    email: "",
  })

  const getPlanDetails = () => {
    const plans = {
      premium: { name: "Premium", monthlyPrice: 9.99, annualPrice: 99.99 },
      annual: { name: "Premium Plus", monthlyPrice: 19.99, annualPrice: 199.99 },
    }

    if (bookId && bookPrice) {
      return { name: "Book Purchase", price: bookPrice }
    }

    const plan = plans[planId as keyof typeof plans]
    if (!plan) return { name: "Free", price: 0 }

    return {
      name: plan.name,
      price: isAnnual ? plan.annualPrice : plan.monthlyPrice,
    }
  }

  const planDetails = getPlanDetails()

  const processPayment = async () => {
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // TODO: Implement server actions for payment processing
      console.log('Payment processing functionality needs server action implementation')
      
      if (bookId && bookPrice) {
        console.log('Book purchase:', { userId, bookId, bookPrice })
      } else {
        console.log('Subscription purchase:', { userId, planId, isAnnual, price: planDetails.price })
      }

      onOpenChange(false)
      window.location.reload()
    } catch (error) {
      console.error("Payment failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isGift ? <Gift className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
            {isGift ? "Gift Subscription" : bookId ? "Purchase Book" : "Upgrade Subscription"}
          </DialogTitle>
          <DialogDescription>
            {isGift
              ? "Give the gift of unlimited reading"
              : bookId
                ? "Complete your book purchase"
                : "Complete your subscription upgrade"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-medium mb-2">Order Summary</h3>
            <div className="flex justify-between items-center">
              <span>{planDetails.name}</span>
              <span className="font-semibold">${planDetails.price}</span>
            </div>
            {!bookId && isAnnual && (
              <div className="text-sm text-green-600 mt-1">
                Save ${((planDetails.price / 12) * 12 - planDetails.price).toFixed(2)} with annual billing
              </div>
            )}
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                value={paymentMethod.cardNumber}
                onChange={(e) => setPaymentMethod((prev) => ({ ...prev, cardNumber: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={paymentMethod.expiryDate}
                  onChange={(e) => setPaymentMethod((prev) => ({ ...prev, expiryDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentMethod.cvv}
                  onChange={(e) => setPaymentMethod((prev) => ({ ...prev, cvv: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="name">Cardholder Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={paymentMethod.name}
                onChange={(e) => setPaymentMethod((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={paymentMethod.email}
                onChange={(e) => setPaymentMethod((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>

          <Separator />

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            Your payment information is secure and encrypted
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={processPayment} disabled={isProcessing} className="flex-1">
              {isProcessing ? "Processing..." : `Pay $${planDetails.price}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
