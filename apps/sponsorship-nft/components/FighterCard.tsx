'use client'

import { Fighter } from '@/data/mockData'

interface FighterCardProps {
  fighter: Fighter
}

export function FighterCard({ fighter }: FighterCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-0 hover:shadow-xl transition-all duration-300 cursor-pointer bg-white overflow-hidden group-hover:border-gray-400 h-full flex flex-col">
      {/* Fighter image */}
      {fighter.avatar ? (
        <div className="w-full h-56 overflow-hidden bg-gray-100 relative">
          <img
            src={fighter.avatar}
            alt={fighter.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback to placeholder if image doesn't exist
              const target = e.currentTarget
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent) {
                parent.className = 'w-full h-56 bg-gray-100 flex items-center justify-center'
                parent.innerHTML = '<span class="text-gray-400 text-sm">Fighter Image</span>'
              }
            }}
          />
        </div>
      ) : (
        <div className="w-full h-56 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Fighter Image</span>
        </div>
      )}
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors">
          {fighter.name}
        </h3>
        <p className="text-gray-700 text-sm font-medium mb-1">{fighter.eventTitle}</p>
        <p className="text-gray-500 text-xs mb-6">{fighter.eventDate}</p>
        
        <button className="w-full py-3 border-2 border-black text-black rounded-lg font-medium hover:bg-black hover:text-white transition-all duration-200 mt-auto">
          View Sponsorship Slots
        </button>
      </div>
    </div>
  )
}

