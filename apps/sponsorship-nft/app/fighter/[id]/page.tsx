'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { WalletButton } from '@/components/WalletButton'
import { ShortsDisplay } from '@/components/ShortsDisplay'
import { SlotPanel } from '@/components/SlotPanel'
import { EventInfo } from '@/components/EventInfo'
import { mockFighterDetails } from '@/data/mockData'
import type { Slot } from '@/data/mockData'

export default function FighterPage() {
  const params = useParams()
  const fighterId = params.id as string
  const originalFighter = mockFighterDetails[fighterId]
  
  // Initialize slots from mock data
  const [slots, setSlots] = useState<Slot[]>(originalFighter?.slots || [])
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(slots[0] || null)

  // Update selectedSlot when slots change
  useEffect(() => {
    if (selectedSlot) {
      const updated = slots.find(s => s.id === selectedSlot.id)
      if (updated && updated !== selectedSlot) {
        setSelectedSlot(updated)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots])

  if (!originalFighter) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Fighter not found</p>
      </div>
    )
  }

  const handleSlotClick = (slot: Slot) => {
    setSelectedSlot(slot)
  }

  const handleSlotUpdate = (slotId: string, updates: Partial<Slot>) => {
    setSlots(prevSlots => 
      prevSlots.map(slot => 
        slot.id === slotId ? { ...slot, ...updates } : slot
      )
    )
    // Update selectedSlot if it's the one being updated
    if (selectedSlot?.id === slotId) {
      setSelectedSlot(prev => prev ? { ...prev, ...updates } : null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <a href="/" className="text-2xl font-bold text-black tracking-tight hover:opacity-80 transition-opacity">
              Sponsor On-Chain
            </a>
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Fighter Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <a 
              href="/" 
              className="text-gray-500 hover:text-black transition-colors text-sm font-medium"
            >
              ← Back to Fighters
            </a>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-3 tracking-tight">
            {originalFighter.name}
          </h1>
          <p className="text-lg text-gray-600">{originalFighter.eventTitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Shorts Display */}
          <div>
            <ShortsDisplay
              slots={slots}
              selectedSlot={selectedSlot}
              onSlotClick={handleSlotClick}
            />
          </div>

          {/* Right: Event Info + Slot Panel */}
          <div className="space-y-6">
            <EventInfo event={originalFighter.event} />
            {selectedSlot && (
              <SlotPanel 
                slot={selectedSlot} 
                fighterId={fighterId}
                onSlotUpdate={handleSlotUpdate}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

