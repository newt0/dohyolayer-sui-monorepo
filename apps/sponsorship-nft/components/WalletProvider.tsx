'use client'

import { WalletKitProvider } from '@mysten/wallet-kit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletKitProvider>
        {children}
      </WalletKitProvider>
    </QueryClientProvider>
  )
}

