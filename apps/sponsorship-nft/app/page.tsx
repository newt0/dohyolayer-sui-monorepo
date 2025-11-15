import Link from 'next/link'
import { WalletButton } from '@/components/WalletButton'
import { FighterCard } from '@/components/FighterCard'
import { mockFighters } from '@/data/mockData'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="text-2xl font-bold text-black tracking-tight hover:opacity-80 transition-opacity">
              Sponsor On-Chain
            </Link>
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight">
            Sponsor On-Chain
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Purchase sponsorship slot NFTs and get your brand logo on real fighting shorts
          </p>
        </div>

        {/* Fighter Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-black mb-3">Available Fighters</h2>
          <p className="text-gray-600 mb-8">Select a fighter to view available sponsorship slots</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {mockFighters.map((fighter) => (
            <Link key={fighter.id} href={`/fighter/${fighter.id}`} className="group">
              <FighterCard fighter={fighter} />
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

