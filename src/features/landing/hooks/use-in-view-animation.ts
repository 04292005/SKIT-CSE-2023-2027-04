"use client"

import { useInView } from "framer-motion"
import { useRef } from "react"

type UseInViewAnimationOptions = {
  once?: boolean
}

export function useInViewAnimation(options: UseInViewAnimationOptions = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    once: options.once ?? true,
    margin: "-80px 0px 0px 0px",
  })

  return { ref, isInView }
}
