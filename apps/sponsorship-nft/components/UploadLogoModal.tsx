'use client'

import { useState } from 'react'
import type { Slot } from '@/data/mockData'

interface UploadLogoModalProps {
  slot: Slot
  onClose: () => void
  onSuccess: (sponsorData: { logo: string; description: string; website: string }) => void
}

export function UploadLogoModal({ slot, onClose, onSuccess }: UploadLogoModalProps) {
  const [step, setStep] = useState(1)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [website, setWebsite] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/png', 'image/svg+xml', 'image/jpeg', 'image/jpg']
      if (!validTypes.includes(file.type)) {
        alert('Please upload PNG, SVG, or JPG format images')
        return
      }
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNext = () => {
    if (!logoFile || !logoPreview) {
      alert('Please upload a logo first')
      return
    }
    setStep(2)
  }

  const handleSubmit = () => {
    if (!description.trim()) {
      alert('Please enter sponsor description')
      return
    }
    if (!website.trim()) {
      alert('Please enter sponsor website URL')
      return
    }
    if (!logoPreview) {
      alert('Please upload a logo')
      return
    }
    // Mock: upload to chain
    console.log('Uploading:', { logoFile, description, website, slot: slot.id })
    
    // Pass sponsor data to parent component
    onSuccess({
      logo: logoPreview, // Use the preview as the logo URL (in production, this would be uploaded to IPFS/storage)
      description: description.trim(),
      website: website.trim()
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">
            {step === 1 ? 'Upload Logo' : 'Sponsor Information'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black"
          >
            ✕
          </button>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Upload Banner Logo
              </label>
              <p className="text-xs text-gray-600 mb-2">
                Supported formats: PNG, SVG, JPG<br />
                Recommended ratio: 4:1 or 5:1
              </p>
              <input
                type="file"
                accept="image/png,image/svg+xml,image/jpeg,image/jpg"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-600 border border-gray-300 rounded cursor-pointer focus:outline-none"
              />
            </div>

            {logoPreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Preview: </p>
                <div className="border border-gray-300 rounded p-4 bg-gray-50">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="max-w-full h-20 object-contain mx-auto"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-300 text-black rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                disabled={!logoFile}
                className="flex-1 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Sponsor Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={200}
                rows={4}
                className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter sponsor description (max 200 characters)"
              />
              <p className="text-xs text-gray-500 mt-1">
                {description.length}/200
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Sponsor Website URL
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="https://example.com"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 border border-gray-300 text-black rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!description.trim() || !website.trim()}
                className="flex-1 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
              >
                Confirm Upload
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

