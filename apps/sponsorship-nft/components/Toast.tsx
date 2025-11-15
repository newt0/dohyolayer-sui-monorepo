'use client'

import { useEffect } from 'react'

interface ToastProps {
  title?: string
  message: string
  type?: 'success' | 'error' | 'info'
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export function Toast({ title, message, type = 'info', isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const iconBg = {
    success: 'bg-black',
    error: 'bg-black',
    info: 'bg-black',
  }[type]

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  }[type]

  return (
    <div className="fixed top-20 right-4 z-50 toast-animate">
      <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-xl min-w-[320px] max-w-md">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`${iconBg} w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0`}>
            <span className="text-white text-sm font-bold">{icon}</span>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="text-sm font-bold text-black mb-1.5 leading-tight">{title}</h4>
            )}
            <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition-colors flex-shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100"
            aria-label="Close"
          >
            <span className="text-xs">✕</span>
          </button>
        </div>
      </div>
    </div>
  )
}

