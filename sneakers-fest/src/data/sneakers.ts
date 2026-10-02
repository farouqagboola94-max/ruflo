export interface Sneaker {
  id: string
  name: string
  brand: string
  colorway: string
  price: number
  retailPrice: number
  size: string[]
  category: string
  condition: 'New' | 'Used' | 'Deadstock'
  image: string
  seller?: string
  featured?: boolean
  marketplace?: boolean
}

export const SNEAKERS: Sneaker[] = [
  {
    id: '1',
    name: 'Air Jordan 1 Retro High OG',
    brand: 'Jordan',
    colorway: 'Chicago Lost & Found',
    price: 250000,
    retailPrice: 165000,
    size: ['7', '8', '9', '10', '11', '12'],
    category: 'Basketball',
    condition: 'Deadstock',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    featured: true,
    marketplace: false,
  },
  {
    id: '2',
    name: 'Nike Air Max 90',
    brand: 'Nike',
    colorway: 'Infrared',
    price: 120000,
    retailPrice: 120000,
    size: ['8', '9', '10', '11'],
    category: 'Lifestyle',
    condition: 'New',
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80',
    featured: true,
    marketplace: false,
  },
  {
    id: '3',
    name: 'Adidas Yeezy Boost 350 V2',
    brand: 'Adidas',
    colorway: 'Zebra',
    price: 300000,
    retailPrice: 200000,
    size: ['9', '9.5', '10', '10.5', '11'],
    category: 'Lifestyle',
    condition: 'Deadstock',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
    featured: true,
    marketplace: true,
    seller: 'KicksMaster',
  },
  {
    id: '4',
    name: 'New Balance 550',
    brand: 'New Balance',
    colorway: 'White/Green',
    price: 90000,
    retailPrice: 90000,
    size: ['7', '8', '9', '10', '11', '12', '13'],
    category: 'Lifestyle',
    condition: 'New',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600&q=80',
    featured: false,
    marketplace: true,
    seller: 'SoleTrader',
  },
  {
    id: '5',
    name: 'Nike Dunk Low',
    brand: 'Nike',
    colorway: 'Panda',
    price: 155000,
    retailPrice: 100000,
    size: ['6', '7', '8', '9', '10'],
    category: 'Skateboarding',
    condition: 'Deadstock',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80',
    featured: false,
    marketplace: true,
    seller: 'HypeDrop',
  },
  {
    id: '6',
    name: 'Converse Chuck 70',
    brand: 'Converse',
    colorway: 'Black Mono',
    price: 72000,
    retailPrice: 72000,
    size: ['6', '7', '8', '9', '10', '11', '12'],
    category: 'Lifestyle',
    condition: 'New',
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&q=80',
    featured: false,
    marketplace: false,
  },
  {
    id: '7',
    name: 'Air Jordan 4 Retro',
    brand: 'Jordan',
    colorway: 'Military Blue',
    price: 380000,
    retailPrice: 190000,
    size: ['8', '9', '10', '11', '12'],
    category: 'Basketball',
    condition: 'Deadstock',
    image: 'https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=600&q=80',
    featured: false,
    marketplace: true,
    seller: 'RetroKicks',
  },
  {
    id: '8',
    name: 'Asics Gel-Kayano 14',
    brand: 'Asics',
    colorway: 'Cream/Navy',
    price: 130000,
    retailPrice: 130000,
    size: ['7', '8', '9', '10', '11'],
    category: 'Running',
    condition: 'New',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80',
    featured: false,
    marketplace: false,
  },
]

export const BRANDS = ['All', 'Jordan', 'Nike', 'Adidas', 'New Balance', 'Converse', 'Asics']
export const CATEGORIES = ['All', 'Basketball', 'Lifestyle', 'Running', 'Skateboarding']
export const CONDITIONS = ['All', 'New', 'Used', 'Deadstock']
