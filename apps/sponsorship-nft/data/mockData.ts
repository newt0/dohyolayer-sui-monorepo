export interface Fighter {
  id: string
  name: string
  avatar?: string
  eventTitle: string
  eventDate: string
}

export interface Slot {
  id: 'A' | 'B' | 'C' | 'D'
  position: string
  status: 'available' | 'minted' | 'sponsored'
  nftName?: string
  price?: number
  sponsor?: {
    logo: string
    description: string
    website: string
  }
  owner?: string
}

export interface FighterDetail extends Fighter {
  event: {
    name: string
    date: string
    venue?: string
    opponent?: string
    isLive?: boolean
  }
  slots: Slot[]
}

export const mockFighters: Fighter[] = [
  {
    id: '1',
    name: 'Weirui',
    avatar: '/fighters/weirui.jpg', // Place your image at public/fighters/weirui.jpg (or .png)
    eventTitle: 'ONE 173',
    eventDate: '2025/11/16',
  },
  {
    id: '2',
    name: 'Fighter B',
    eventTitle: 'Rise 2024 Tokyo',
    eventDate: '2024/11/03',
  },
  {
    id: '3',
    name: 'Fighter C',
    eventTitle: 'Rise 2024 Tokyo',
    eventDate: '2024/11/03',
  },
  {
    id: '4',
    name: 'Fighter D',
    eventTitle: 'Rise 2024 Tokyo',
    eventDate: '2024/11/03',
  },
]

export const mockFighterDetails: Record<string, FighterDetail> = {
  '1': {
    id: '1',
    name: 'Weirui',
    avatar: '/fighters/weirui.jpg', // Place your image at public/fighters/weirui.jpg (or .png)
    eventTitle: 'ONE 173',
    eventDate: '2025/11/16',
    event: {
      name: 'ONE 173',
      date: '2025/11/16',
      venue: 'Ariake Arena',
      opponent: 'Akimoto',
      isLive: false,
    },
    slots: [
      {
        id: 'A',
        position: 'Left Leg Upper',
        status: 'sponsored',
        nftName: 'Weirui Sponsorship #A',
        sponsor: {
          logo: '/logos/sponsor-a.svg',
          description: 'Sui is a first-of-its-kind Layer 1 blockchain and smart contract platform designed to make digital asset ownership fast, private, secure, and accessible.',
          website: 'https://sui.io',
        },
      },
      {
        id: 'B',
        position: 'Left Leg Lower',
        status: 'minted',
        nftName: 'Weirui Sponsorship #B',
        price: 10,
        // owner is not set, so any connected wallet can upload (for demo purposes)
      },
      {
        id: 'C',
        position: 'Right Leg Upper',
        status: 'available',
        nftName: 'Weirui Sponsorship #C',
        price: 10,
      },
      {
        id: 'D',
        position: 'Right Leg Lower',
        status: 'available',
        nftName: 'Weirui Sponsorship #D',
        price: 10,
      },
    ],
  },
}

