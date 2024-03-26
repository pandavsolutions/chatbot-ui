import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "@/supabase/types"
import {
  calculateMessageCredits,
  deductCreditsForMessages
} from "@/lib/supabase/server-chat-tokens"

export const getMessageById = async (messageId: string) => {
  const { data: message } = await supabase
    .from("messages")
    .select("*")
    .eq("id", messageId)
    .single()

  if (!message) {
    throw new Error("Message not found")
  }

  return message
}

export const getMessagesByChatId = async (chatId: string) => {
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)

  if (!messages) {
    throw new Error("Messages not found")
  }

  return messages
}

export const createMessage = async (message: TablesInsert<"messages">) => {
  const { data: createdMessage, error } = await supabase
    .from("messages")
    .insert([message])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const credits = await calculateMessageCredits([createdMessage!])
  const { data: new_credits } = await deductCreditsForMessages(
    createdMessage.chat_id,
    createdMessage.id,
    Math.ceil(credits)
  )

  return createdMessage
}

export const createMessages = async (messages: TablesInsert<"messages">[]) => {
  const { data: createdMessages, error } = await supabase
    .from("messages")
    .insert(messages)
    .select("*")

  if (error) {
    throw new Error(error.message)
  }

  const credits = await calculateMessageCredits(createdMessages!)

  // TODO - Review this. This assumes that the chat_id and message_id are the same for all messages
  let chat_id = createdMessages![0].chat_id
  let message_id = createdMessages![0].id
  const { data: new_credits } = await deductCreditsForMessages(
    chat_id,
    message_id,
    Math.ceil(credits)
  )

  return createdMessages
}

export const updateMessage = async (
  messageId: string,
  message: TablesUpdate<"messages">
) => {
  const { data: updatedMessage, error } = await supabase
    .from("messages")
    .update(message)
    .eq("id", messageId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const credits = await calculateMessageCredits([updatedMessage!])
  const { data: new_credits } = await deductCreditsForMessages(
    updatedMessage.chat_id,
    updatedMessage.id,
    Math.ceil(credits)
  )

  return updatedMessage
}

export const deleteMessage = async (messageId: string) => {
  const { error } = await supabase.from("messages").delete().eq("id", messageId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export async function deleteMessagesIncludingAndAfter(
  userId: string,
  chatId: string,
  sequenceNumber: number
) {
  const { error } = await supabase.rpc("delete_messages_including_and_after", {
    p_user_id: userId,
    p_chat_id: chatId,
    p_sequence_number: sequenceNumber
  })

  if (error) {
    return {
      error: "Failed to delete messages."
    }
  }

  return true
}
