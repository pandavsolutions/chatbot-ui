"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/browser-client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import * as Separator from "@radix-ui/react-separator"

const subscriptionOptions = [
  {
    name: "Basic Plan",
    price: "15 AUD",
    features: ["30,000 Credits", "10 Assistants", "10 Tools"],
    description:
      "Access to chatbot with multiple LLM models including Gemini Pro models, Claude Models, Openai models."
  },
  {
    name: "Pro Plan",
    price: "30 AUD",
    features: ["100,000 Credits", "100 Assistants", "100 Tools"],
    description:
      "Access to chatbot with multiple LLM models including Gemini Pro models, Claude Models, Openai models."
  },
  {
    name: "Enterprise Plan",
    price: "Contact Us",
    features: ["Custom credits", "Charts Generation", "Agents"],
    description:
      "Access to chatbot with multiple LLM models including Gemini Pro models, Claude Models, Openai models."
  }
]

export default function Checkout() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckOut = async (subType: string) => {
    setIsLoading(true) // Start loading

    try {
      const session = (await supabase.auth.getSession()).data.session
      const user = session?.user.id
      const email = session?.user.email

      if (!user) {
        router.push("/login")
        return
      }

      // Depending on subType, handle different checkout flows
      console.log(subType) // This is just for demonstration. Replace it with your checkout logic.

      // Example: const data = JSON.parse(await checkout(email!, location.origin + "/checkout", subType));

      // Here, you'd call Stripe or your backend service to handle the subscription.
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setIsLoading(false) // End loading
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {subscriptionOptions.map(option => (
        <Card
          key={option.name}
          className="max-h-[calc(100vh-60px)] w-full overflow-auto md:w-[300px]"
        >
          <CardHeader>
            <CardTitle>{option.name}</CardTitle>
          </CardHeader>

          <CardContent>
            <CardDescription>{option.description}</CardDescription>
            {option.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-2 py-3"
              >
                <Separator.Root
                  className="SeparatorRoot"
                  style={{ margin: "15px 0" }}
                />
                {/* <div className="w-3 h-3 bg-green-500 rounded-full" /> */}
                <div className="Text">{feature}</div>
              </div>
            ))}
          </CardContent>

          <CardFooter className="flex justify-center">
            <button
              className="rounded-md px-6 py-2.5 text-center ring-1 ring-green-500"
              type="button"
              disabled={isLoading}
              onClick={() => handleCheckOut(option.name)}
            >
              {option.price}
            </button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
