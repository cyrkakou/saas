"use client"

// Adapted from https://ui.shadcn.com/docs/components/toast
import { useEffect, useState } from "react"

const TOAST_TIMEOUT = 5000

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

type ToastState = {
  open: boolean
  props: ToastProps
}

let toastState: ToastState = {
  open: false,
  props: {}
}

let listeners: Array<(state: ToastState) => void> = []

function subscribe(listener: (state: ToastState) => void) {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter(l => l !== listener)
  }
}

// Export the notify function as toast for direct imports
export const toast = (props: ToastProps) => {
  toastState = { ...toastState, open: true, props }
  listeners.forEach(listener => listener(toastState))

  // Auto-close toast after timeout
  setTimeout(() => {
    toastState = { ...toastState, open: false }
    listeners.forEach(listener => listener(toastState))
  }, TOAST_TIMEOUT)
}

// Keep the notify function for internal use
function notify(props: ToastProps) {
  toast(props)
}

export function useToast() {
  const [state, setState] = useState<ToastState>(toastState)

  useEffect(() => {
    const unsubscribe = subscribe(setState)
    return unsubscribe
  }, [])

  return {
    toast: notify,
    ...state,
  }
}

export function Toast({ title, description, variant = "default" }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const timer = setTimeout(() => {
      setVisible(false)
    }, TOAST_TIMEOUT - 300) // Slightly shorter to allow for fade-out animation

    return () => clearTimeout(timer)
  }, [])

  const baseClasses = "fixed bottom-4 right-4 p-4 rounded-md shadow-md transition-opacity duration-300"
  const variantClasses = variant === "destructive"
    ? "bg-red-600 text-white"
    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"

  return (
    <div className={`${baseClasses} ${variantClasses} ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {title && <div className="font-medium">{title}</div>}
      {description && <div className="text-sm mt-1">{description}</div>}
    </div>
  )
}

// This is the component that should be added to your layout
export function Toaster() {
  const { open, props } = useToast()

  if (!open) return null

  return <Toast {...props} />
}
