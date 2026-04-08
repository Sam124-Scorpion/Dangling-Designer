export interface Outfit {
  name: string
  description: string
  price: string
  image_search: string
  buy_link: string
  buy_label: string
  image_url?: string
}

export interface AIResponse {
  message: string
  outfits: Outfit[]
  followup: string
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
  parsed?: AIResponse
}
