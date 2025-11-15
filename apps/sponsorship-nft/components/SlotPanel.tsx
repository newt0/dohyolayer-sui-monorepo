'use client'

import { useState } from 'react'
import { useWalletKit } from '@mysten/wallet-kit'
import type { Slot } from '@/data/mockData'
import { UploadLogoModal } from './UploadLogoModal'
import { Toast } from './Toast'

interface SlotPanelProps {
  slot: Slot
  fighterId: string
  onSlotUpdate?: (slotId: string, updates: Partial<Slot>) => void
}

export function SlotPanel({ slot, fighterId, onSlotUpdate }: SlotPanelProps) {
  const { isConnected, currentAccount } = useWalletKit()
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [toast, setToast] = useState<{ title?: string; message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    title: undefined,
    message: '',
    type: 'info',
    isVisible: false,
  })

  // For demo purposes: if slot is minted and user is connected, show upload button
  // In production, this should strictly check: slot.owner === currentAccount.address
  const isOwner = slot.status === 'minted' && isConnected && currentAccount && (
    !slot.owner || // For demo: if no owner set, allow any connected user to upload
    slot.owner === currentAccount.address // Or if user is the actual owner
  )

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', title?: string) => {
    setToast({ title, message, type, isVisible: true })
  }

  const handleMint = async () => {
    if (!isConnected) {
      showToast('Please connect your wallet first', 'error')
      return
    }
    // Mock mint
    showToast('Metadata has been uploaded to Walrus.', 'info', 'Successfully minted!')
  }

  const handleBuyOnMarket = () => {
    // Mock: redirect to market
    showToast('Mock: Redirecting to NFT marketplace', 'info')
  }

  const handleUpload = () => {
    if (!isOwner) {
      showToast('You are not the owner of this NFT', 'error')
      return
    }
    setShowUploadModal(true)
  }

  const handleUploadSuccess = (sponsorData: { logo: string; description: string; website: string }) => {
    setShowUploadModal(false)
    // Update slot to sponsored status temporarily
    if (onSlotUpdate) {
      onSlotUpdate(slot.id, {
        status: 'sponsored',
        sponsor: sponsorData
      })
    }
    showToast('Logo uploaded successfully! The slot will show as sponsored until page refresh.', 'success')
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-black mb-6 tracking-tight">Slot Information</h3>

        <div className="space-y-4">
          {/* Slot Position */}
          <div>
            <span className="text-sm text-gray-600">📍 Slot Position: </span>
            <span className="text-sm font-medium text-black ml-2">{slot.id} ({slot.position})</span>
          </div>

          {/* Status */}
          <div>
            <span className="text-sm text-gray-600">📌 Status: </span>
            <span className="text-sm font-medium text-black ml-2">
              {slot.status === 'sponsored' ? 'Sponsored' :
               slot.status === 'minted' ? 'Minted' :
               'Available'}
            </span>
          </div>

          {/* Content based on status */}
          {slot.status === 'sponsored' && slot.sponsor && (
            <>
              <div>
                <span className="text-sm text-gray-600">🖼 Sponsor Logo: </span>
                <div className="mt-2">
                  <img
                    src={slot.sponsor.logo}
                    alt="Sponsor Logo"
                    className="max-w-full h-16 object-contain border border-gray-200 rounded"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-logo.svg'
                    }}
                  />
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">📝 Sponsor Description: </span>
                <p className="text-sm text-black mt-1">{slot.sponsor.description}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">🔗 Sponsor Website: </span>
                <a
                  href={slot.sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline ml-2"
                >
                  {slot.sponsor.website}
                </a>
              </div>
            </>
          )}

          {slot.status === 'available' && (
            <>
              <div>
                <span className="text-sm text-gray-600">🔖 NFT Information: </span>
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-medium text-black">{slot.nftName}</p>
                  <p className="text-xs text-gray-600">
                    The owner of this NFT can upload a brand logo, which will be displayed on the fighter&apos;s shorts during the match.
                  </p>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">💰 Price: </span>
                <span className="text-sm font-medium text-black ml-2">{slot.price} SUI</span>
              </div>
              <button
                onClick={handleMint}
                className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md mt-4"
              >
                Mint
              </button>
            </>
          )}

          {slot.status === 'minted' && (
            <>
              <div>
                <span className="text-sm text-gray-600">🔖 NFT Information: </span>
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-medium text-black">{slot.nftName}</p>
                  <p className="text-xs text-gray-600">
                    NFT holders can upload a logo
                  </p>
                </div>
              </div>
              {!isConnected && (
                <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
                  💡 NFT holder can connect their wallet to upload a logo
                </div>
              )}
              {isOwner ? (
                <button
                  onClick={handleUpload}
                  className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md mt-4"
                >
                  🖼 Upload Logo
                </button>
              ) : (
                <button
                  onClick={handleBuyOnMarket}
                  className="w-full py-3 border-2 border-black text-black rounded-lg font-medium hover:bg-black hover:text-white transition-all duration-200 mt-4"
                >
                  🛒 Buy on Market
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {showUploadModal && (
        <UploadLogoModal
          slot={slot}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}

      <Toast
        title={toast.title}
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </>
  )
}

