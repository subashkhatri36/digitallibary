"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Check, Crown, BookOpen, Zap } from "lucide-react"
import { PaymentDialog } from "@/components/payment-dialog"

interface SubscriptionPlansProps {
  currentTier: string
  userId: string
}

export function SubscriptionPlans({ currentTier, userId }: SubscriptionPlansProps) {
  const [isAnnual, setIsAnnual] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  const plans = [
    {
      id: "free",
      name: "Free",
      description: "Perfect for casual readers",
      monthlyPrice: 0,
      annualPrice: 0,
      icon: BookOpen,
      features: [
        "Access to free books",
        "2-page previews",
        "Basic reading features",
        "Personal library",
        "Reading progress tracking",
      ],
      limitations: ["Limited book selection", "No premium books", "No offline reading"],
    },
    {
      id: "premium",
      name: "Premium",
      description: "For avid readers who want more",
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      icon: Crown,
      popular: true,
      features: [
        "Access to all books",
        "Unlimited reading",
        "Offline reading",
        "Advanced reading features",
        "Priority customer support",
        "Reading analytics",
        "Custom reading lists",
        "Book recommendations",
      ],
      savings: "Save $20/year",
    },
    {
      id: "annual",
      name: "Premium Plus",
      description: "Ultimate reading experience",
      monthlyPrice: 19.99,
      annualPrice: 199.99,
      icon: Zap,
      features: [
        "Everything in Premium",
        "Early access to new releases",
        "Exclusive author content",
        "Advanced AI recommendations",
        "Unlimited audiobooks",
        "Gift subscriptions",
        "Priority book requests",
        "Beta feature access",
      ],
      savings: "Save $40/year",
    },
  ]

  const handleSelectPlan = (planId: string) => {
    if (planId === currentTier) return
    setSelectedPlan(planId)
    setShowPaymentDialog(true)
  }

  const getPrice = (plan: any) => {
    if (plan.monthlyPrice === 0) return "Free"
    return isAnnual ? `$${plan.annualPrice}/year` : `$${plan.monthlyPrice}/month`
  }

  const getButtonText = (planId: string) => {
    if (planId === currentTier) return "Current Plan"
    if (planId === "free") return "Downgrade"
    return currentTier === "free" ? "Upgrade" : "Change Plan"
  }

  return (
    <div className="space-y-8">
      {/* Annual/Monthly Toggle */}
      <div className="flex items-center justify-center gap-4">
        <Label htmlFor="billing-toggle" className={!isAnnual ? "font-semibold" : ""}>
          Monthly
        </Label>
        <Switch id="billing-toggle" checked={isAnnual} onCheckedChange={setIsAnnual} />
        <Label htmlFor="billing-toggle" className={isAnnual ? "font-semibold" : ""}>
          Annual
          <Badge variant="secondary" className="ml-2">
            Save up to 20%
          </Badge>
        </Label>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const Icon = plan.icon
          const isCurrentPlan = plan.id === currentTier
          const price = getPrice(plan)

          return (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular ? "border-amber-500 shadow-lg scale-105" : ""
              } ${isCurrentPlan ? "ring-2 ring-green-500" : ""}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-600">Most Popular</Badge>
              )}
              {isCurrentPlan && <Badge className="absolute -top-3 right-4 bg-green-600">Current Plan</Badge>}

              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-full">
                    <Icon className="h-8 w-8 text-amber-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">{price}</div>
                  {plan.savings && isAnnual && <div className="text-sm text-green-600 font-medium">{plan.savings}</div>}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limitations (for free plan) */}
                {plan.limitations && (
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="text-sm font-medium text-muted-foreground">Limitations:</h4>
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="h-4 w-4 rounded-full bg-gray-300 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Button */}
                <Button
                  className="w-full"
                  variant={isCurrentPlan ? "outline" : plan.popular ? "default" : "outline"}
                  disabled={isCurrentPlan}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {getButtonText(plan.id)}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Payment Dialog */}
      {selectedPlan && (
        <PaymentDialog
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
          planId={selectedPlan}
          isAnnual={isAnnual}
          userId={userId}
          currentTier={currentTier}
        />
      )}
    </div>
  )
}
