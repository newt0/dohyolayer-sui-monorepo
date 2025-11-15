'use client'

import { useWalletKit, ConnectButton } from '@mysten/wallet-kit'
import { useEffect, useState } from 'react'

export function WalletButton() {
  const { isConnected, currentAccount, disconnect } = useWalletKit()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
    )
  }

  if (isConnected && currentAccount) {
    const address = currentAccount.address
    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`
    
    // Generate simple avatar (based on address)
    const avatarBg = address.slice(0, 6)
    
    return (
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
          style={{ backgroundColor: `#${avatarBg}` }}
        >
          {address.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-black">{shortAddress}</span>
        </div>
        <button
          onClick={disconnect}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-black font-medium transition-colors"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="[&_button]:px-6 [&_button]:py-2 [&_button]:bg-black [&_button]:text-white [&_button]:rounded [&_button]:hover:bg-gray-800 [&_button]:transition-colors">
      <ConnectButton />
    </div>
  )
}

