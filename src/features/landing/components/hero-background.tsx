"use client"

import { motion } from "framer-motion"

import { useReducedMotionPreference } from "@/features/landing/hooks"

export function HeroBackground() {
  const prefersReducedMotion = useReducedMotionPreference()

  if (prefersReducedMotion) {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-24 left-1/4 h-[30rem] w-[30rem] rounded-full bg-emerald-400/10" 
          style={{ filter: "blur(160px)" }} 
        />
        <div 
          className="absolute top-1/4 -right-16 h-[28rem] w-[28rem] rounded-full bg-cyan-400/10" 
          style={{ filter: "blur(160px)" }} 
        />
        <div 
          className="absolute -bottom-24 left-10 h-[32rem] w-[32rem] rounded-full bg-indigo-400/10" 
          style={{ filter: "blur(160px)" }} 
        />
      </div>
    )
  }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Emerald Blob */}
      <motion.div
        className="absolute -top-24 left-1/4 h-[30rem] w-[30rem] rounded-full bg-emerald-400/10"
        style={{ filter: "blur(160px)" }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          opacity: [0.08, 0.15, 0.08]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
      {/* Cyan Blob */}
      <motion.div
        className="absolute top-1/4 -right-16 h-[28rem] w-[28rem] rounded-full bg-cyan-400/10"
        style={{ filter: "blur(160px)" }}
        animate={{
          x: [0, -30, 30, 0],
          y: [0, 40, -20, 0],
          opacity: [0.06, 0.12, 0.06]
        }}
        transition={{
          duration: 19,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
      {/* Indigo Blob */}
      <motion.div
        className="absolute -bottom-24 left-10 h-[32rem] w-[32rem] rounded-full bg-indigo-400/10"
        style={{ filter: "blur(160px)" }}
        animate={{
          x: [0, 25, -25, 0],
          y: [0, -40, 30, 0],
          opacity: [0.07, 0.14, 0.07]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
    </div>
  )
}
