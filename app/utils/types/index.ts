export interface Category {
  id: number
  name: string
}

export interface Product {
  id: number
  categoryId: string | number
  imageUrl: string
  name: string
  description: string
  price: number
}

export interface ProductCard {
  id: number
  quantity: number
}
