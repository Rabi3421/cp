export type Outfit = {
  id: string
  title: string
  celebrity: string
  celebrityId: string
  image: string
  event: string
  date: string
  description: string
  items: OutfitItem[]
  totalCost?: string
  tags: string[]
}

export type OutfitItem = {
  name: string
  brand: string
  category: string
  price: string
  link?: string
  image?: string
}
