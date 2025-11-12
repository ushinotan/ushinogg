'use client'

import BotInfo from "@/components/organisms/BotInfo";
import Features from "@/components/organisms/Features";
import Commands from "@/components/organisms/Commands";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <BotInfo />
        <Features />
        <Commands />
      </div>
    </div>
  )
}
