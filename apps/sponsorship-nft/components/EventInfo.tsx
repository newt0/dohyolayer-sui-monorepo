interface Event {
  name: string
  date: string
  venue?: string
  opponent?: string
  isLive?: boolean
}

interface EventInfoProps {
  event: Event
}

export function EventInfo({ event }: EventInfoProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-xl font-bold text-black mb-6 tracking-tight">Event Information</h3>
      <div className="space-y-3">
        <div>
          <span className="text-sm text-gray-600">Event Name: </span>
          <span className="text-sm font-medium text-black">{event.name}</span>
        </div>
        <div>
          <span className="text-sm text-gray-600">Date: </span>
          <span className="text-sm font-medium text-black">{event.date}</span>
        </div>
        {event.venue && (
          <div>
            <span className="text-sm text-gray-600">Venue: </span>
            <span className="text-sm font-medium text-black">{event.venue}</span>
          </div>
        )}
        {event.opponent && (
          <div>
            <span className="text-sm text-gray-600">Opponent: </span>
            <span className="text-sm font-medium text-black">{event.opponent}</span>
          </div>
        )}
      </div>
    </div>
  )
}

