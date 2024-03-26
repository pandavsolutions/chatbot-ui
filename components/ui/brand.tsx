"use client"

import Link from "next/link"
import { FC } from "react"
// import { ChatbotUISVG } from "../icons/chatbotui-svg"

interface BrandProps {
  theme?: "dark" | "light"
}

export const Brand: FC<BrandProps> = ({ theme = "dark" }) => {
  console.log(window.location)
  return (
    <Link
      className="flex cursor-pointer flex-col items-center hover:opacity-50"
      href="https://www.pandav.com.au"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="mb-2">
        <img
          src={window.location.origin.concat("/icon-512x512.png")}
          width="128"
          height="128"
        ></img>
        {/* <ChatbotUISVG theme={theme === "dark" ? "dark" : "light"} scale={0.3} /> */}
      </div>

      <div className="text-4xl font-bold tracking-wide">Chatur</div>
    </Link>
  )
}
