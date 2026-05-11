'use client'

import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'

interface SubmitButtonProps {
  children?: React.ReactNode
  className?: string
  loadingText?: string
  icon?: React.ReactNode
  disabled?: boolean
}

export default function SubmitButton({ 
  children, 
  className, 
  loadingText = "Memproses...", 
  icon,
  disabled
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={`${className} ${pending ? 'cursor-not-allowed opacity-80' : ''}`}
    >
      {pending ? (
        <div className="flex items-center justify-center gap-2 w-full">
          <Loader2 className="animate-spin" size={18} />
          <span className="uppercase tracking-widest">{loadingText}</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 w-full">
          {children}
          {icon}
        </div>
      )}
    </button>
  )
}
