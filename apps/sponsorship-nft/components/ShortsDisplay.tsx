'use client'

import type { Slot } from '@/data/mockData'

interface ShortsDisplayProps {
  slots: Slot[]
  selectedSlot: Slot | null
  onSlotClick: (slot: Slot) => void
}

export function ShortsDisplay({ slots, selectedSlot, onSlotClick }: ShortsDisplayProps) {
  const slotMap = {
    A: slots.find(s => s.id === 'A'),
    B: slots.find(s => s.id === 'B'),
    C: slots.find(s => s.id === 'C'),
    D: slots.find(s => s.id === 'D'),
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-black mb-8 text-center tracking-tight">Fighter Shorts</h2>
      
      {/* Shorts Container */}
      <div className="relative mx-auto" style={{ width: '400px', height: '500px' }}>
        {/* 
          Shorts image should be placed at public/shorts/shorts.png
          Slot positions:
          - A: Left Leg Upper (x: 80, y: 120, width: 100, height: 40)
          - B: Left Leg Lower (x: 80, y: 280, width: 100, height: 40)
          - C: Right Leg Upper (x: 220, y: 120, width: 100, height: 40)
          - D: Right Leg Lower (x: 220, y: 280, width: 100, height: 40)
        */}
        <div className="relative w-full h-full">
          {/* Shorts image - try PNG first, fallback to SVG placeholder */}
          <img
            src="/shorts/shorts.png"
            alt="Fighter Shorts"
            className="w-full h-full object-contain"
            onError={(e) => {
              // If PNG doesn't exist, try SVG placeholder
              const target = e.currentTarget
              if (target.src.includes('.png')) {
                target.src = '/shorts/shorts.svg'
                target.onerror = null // Prevent infinite loop
              } else {
                // If SVG also doesn't exist, show placeholder
                target.style.display = 'none'
                const placeholder = document.createElement('div')
                placeholder.className = 'w-full h-full bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center absolute inset-0'
                placeholder.innerHTML = `
                  <div class="text-center">
                    <p class="text-gray-400 text-sm mb-2">Fighter Shorts</p>
                    <p class="text-gray-400 text-xs">Placeholder Image</p>
                  </div>
                `
                target.parentElement?.appendChild(placeholder)
              }
            }}
          />

          {/* Slot Overlays */}
          {/* Slot A - Left Leg Upper */}
          {slotMap.A && (
            <SlotOverlay
              slot={slotMap.A}
              position={{ top: '120px', left: '80px', width: '100px', height: '40px' }}
              isSelected={selectedSlot?.id === 'A'}
              onClick={() => onSlotClick(slotMap.A!)}
            />
          )}

          {/* Slot B - Left Leg Lower */}
          {slotMap.B && (
            <SlotOverlay
              slot={slotMap.B}
              position={{ top: '280px', left: '80px', width: '100px', height: '40px' }}
              isSelected={selectedSlot?.id === 'B'}
              onClick={() => onSlotClick(slotMap.B!)}
            />
          )}

          {/* Slot C - Right Leg Upper */}
          {slotMap.C && (
            <SlotOverlay
              slot={slotMap.C}
              position={{ top: '120px', left: '220px', width: '100px', height: '40px' }}
              isSelected={selectedSlot?.id === 'C'}
              onClick={() => onSlotClick(slotMap.C!)}
            />
          )}

          {/* Slot D - Right Leg Lower */}
          {slotMap.D && (
            <SlotOverlay
              slot={slotMap.D}
              position={{ top: '280px', left: '220px', width: '100px', height: '40px' }}
              isSelected={selectedSlot?.id === 'D'}
              onClick={() => onSlotClick(slotMap.D!)}
            />
          )}
        </div>
      </div>

      {/* Slot Legend */}
      <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded border-2 border-gray-300 flex items-center justify-center text-xs font-bold text-black">A</span>
          <span className="text-gray-700">Left Leg Upper</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded border-2 border-gray-300 flex items-center justify-center text-xs font-bold text-black">B</span>
          <span className="text-gray-700">Left Leg Lower</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded border-2 border-gray-300 flex items-center justify-center text-xs font-bold text-black">C</span>
          <span className="text-gray-700">Right Leg Upper</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded border-2 border-gray-300 flex items-center justify-center text-xs font-bold text-black">D</span>
          <span className="text-gray-700">Right Leg Lower</span>
        </div>
      </div>
    </div>
  )
}

interface SlotOverlayProps {
  slot: Slot
  position: { top: string; left: string; width: string; height: string }
  isSelected: boolean
  onClick: () => void
}

function SlotOverlay({ slot, position, isSelected, onClick }: SlotOverlayProps) {
  const getSlotStyle = () => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      ...position,
      cursor: 'pointer',
      border: isSelected ? '3px solid white' : '2px solid white',
      boxShadow: isSelected 
        ? '0 0 0 2px black, 0 4px 12px rgba(0, 0, 0, 0.3)' 
        : '0 2px 8px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5)',
      transition: 'all 0.2s',
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '4px',
    }

    if (slot.status === 'sponsored' && slot.sponsor) {
      return {
        ...baseStyle,
        padding: '4px',
      }
    } else if (slot.status === 'minted') {
      return {
        ...baseStyle,
        padding: '2px',
      }
    } else {
      return {
        ...baseStyle,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderStyle: 'dashed',
        padding: '2px',
      }
    }
  }

  return (
    <div 
      style={getSlotStyle()} 
      onClick={onClick}
      className={isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''}
    >
      {slot.status === 'sponsored' && slot.sponsor ? (
        <img
          src={slot.sponsor.logo}
          alt="Sponsor Logo"
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            // Fallback if image doesn't exist
            e.currentTarget.src = '/placeholder-logo.svg'
            e.currentTarget.onerror = null // Prevent infinite loop
          }}
        />
      ) : slot.status === 'minted' ? (
        <span className="text-xs font-semibold text-black">Owned</span>
      ) : (
        <span className="text-xs font-semibold text-gray-500">Mintable</span>
      )}
    </div>
  )
}

