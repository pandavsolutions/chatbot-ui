"use client"

// import { ChatbotUISVG } from "@/components/icons/chatbotui-svg"
import {} from "next/navigation"
import { IconArrowRight } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import Link from "next/link"

export default function HomePage() {
  const { theme } = useTheme()

  // console.log(usePathname())
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <div>
        <img src="/icon-192x192.png" width="96" height="96"></img>
        {/* <ChatbotUISVG theme={theme === "dark" ? "dark" : "light"} scale={0.3} /> */}
      </div>

      <div className="mt-2 text-4xl font-bold">Chatur-ai</div>

      <Link
        className="mt-4 flex w-[200px] items-center justify-center rounded-md bg-blue-500 p-2 font-semibold"
        href="/login"
      >
        Start Chatting
        <IconArrowRight className="ml-1" size={20} />
      </Link>
    </div>
  )
}
