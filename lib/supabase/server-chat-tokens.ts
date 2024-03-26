import { Database, Tables } from "@/supabase/types"
import { supabase } from "@/lib/supabase/browser-client"
// import { createServerClient } from "@supabase/ssr"
// import { TablesInsert, TablesUpdate } from "@/supabase/types"
import { Message } from "ai"
import {
  CREDITS_PER_INPUT_TOKEN,
  CREDITS_PER_OUTPUT_TOKEN
} from "../models/llm/token-map"
// import { cookies } from "next/headers"

// CREATED credits_left column in profile for this.

export async function getCreditsLeft() {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) {
    throw new Error("User not found")
  }

  const { data: credits_left } = await supabase
    .from("profiles")
    .select("credits_left")
    .eq("user_id", user.id)
    .single()

  if (!credits_left) {
    throw new Error("Profile not found")
  }

  return credits_left
}

export async function deductCreditsForMessages(
  chat_id: string,
  message_id: string,
  credits: number
) {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) {
    throw new Error("User not found")
  }

  const { data: credits_data } = await supabase
    .from("profiles")
    .select("credits_left")
    .eq("user_id", user.id)
    .single()

  if (!credits_data) {
    throw new Error("Profile not found")
  }

  let new_credits = Math.ceil(credits_data.credits_left - credits)

  const { error } = await supabase
    .from("profiles")
    .update({ credits_left: new_credits })
    .eq("user_id", user.id)

  if (error) {
    throw new Error("Credits update failed.")
  }

  // log the token transaction to tokens_log table
  const { error: error2 } = await supabase
    .from("tokens_log")
    .insert([
      {
        user_id: user.id,
        chat_id: chat_id,
        message_id: message_id,
        prev_token: credits_data.credits_left,
        tokens_consumed: credits,
        new_token: new_credits
      }
    ])

  if (error2) {
    throw new Error("Error logging credits.")
  }
  return { data: new_credits }
}

export async function calculateMessageCredits(messages: Tables<"messages">[]) {
  // loop through messages and calculate credits
  let total_credits = 0
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]
    const message_length = message.content.length
    let credits = 0
    if (message.role === "user") {
      if (message.image_paths.length > 0) {
        credits =
          CREDITS_PER_INPUT_TOKEN[
            message.model as keyof typeof CREDITS_PER_INPUT_TOKEN
          ]
      } else {
        credits =
          Math.ceil(message_length / 4) *
          CREDITS_PER_INPUT_TOKEN[
            message.model as keyof typeof CREDITS_PER_INPUT_TOKEN
          ]
      }
    } else {
      credits =
        Math.ceil(message_length / 4) *
        CREDITS_PER_OUTPUT_TOKEN[
          message.model as keyof typeof CREDITS_PER_OUTPUT_TOKEN
        ]
    }

    total_credits += credits
  }

  return total_credits
}
