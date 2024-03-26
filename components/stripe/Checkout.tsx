"use client"
import React, { ChangeEvent, useTransition } from "react"
import { LightningBoltIcon } from "@radix-ui/react-icons"
import { useUser } from "@/lib/store/user"
import { cn } from "@/lib/utils"
import { loadStripe } from "@stripe/stripe-js"
import { checkout } from "@/lib/stripe/actions"
import { usePathname } from "next/navigation"
import LoginForm from "../nav/LoginForm"
export default function Checkout() {
  const pathname = usePathname()

  const [isPending, startTransition] = useTransition()

  const user = useUser(state => state.user)

  const handleCheckOut = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    startTransition(async () => {
      const data = JSON.parse(
        await checkout(user?.email!, location.origin + pathname)
      )
      const result = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!
      )
      await result?.redirectToCheckout({ sessionId: data.id })
    })
  }

  if (!user) {
    return (
      <div className="flex h-96 items-center justify-center gap-2">
        <LoginForm /> to continue
      </div>
    )
  }

  return (
    <form
      onSubmit={handleCheckOut}
      className={cn(
        "flex h-96  w-full items-center justify-center ",
        { hidden: !user?.id },
        { " animate-pulse": isPending }
      )}
    >
      <button
        className="rounded-md p-10 text-center ring-1 ring-green-500"
        type="submit"
      >
        <h1 className="flex  items-center gap-2 text-2xl font-bold uppercase text-green-500">
          <LightningBoltIcon
            className={cn(
              " size-5 animate-bounce",
              !isPending ? "animate-bounce" : "animate-spin"
            )}
          />
          Upgrade to pro
        </h1>
        <p className="text-sm text-gray-500">Unlock all Daily blog contents</p>
      </button>
    </form>
  )
}
