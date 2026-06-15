export interface Category {
  id: number
  name: string
}

export interface Promotion {
  tipo: 'porcentaje' | 'precio'
  valor: number
  status: boolean
}

export interface Product {
  id: number
  categoryId: string | number
  imageUrl: string
  name: string
  description: string
  price: number
  status?: boolean
  promotion?: Promotion
  /** false cuando algún ingrediente está bajo el stock mínimo — la carta lo oculta */
  available?: boolean
}

export interface ProductCard {
  id: number
  quantity: number
}

export interface Table {
  id: number
  number: number
  status: 'free' | 'occupied' | 'reserved'
  capacity: number
}

export interface OrderItem {
  productId: number
  name: string
  price: number
  quantity: number
  imageUrl?: string
}

export type OrderType = 'delivery' | 'room'
export type PaymentMethod = 'cash' | 'card'
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered'

export interface CreateOrderRequest {
  type: OrderType
  tableId?: number
  customerName?: string
  address?: string
  phone?: string
  paymentMethod: PaymentMethod
  items: OrderItem[]
  tip?: number
}

export interface Order {
  id: string
  /** Código legible del pedido (ej. ORD-XXXXXXXX) — usar para boleta URL */
  code?: string
  type: OrderType
  tableId?: number
  tableNumber?: number
  customerName?: string
  address?: string
  phone?: string
  paymentMethod: PaymentMethod
  items: OrderItem[]
  subtotal: number
  tip: number
  total: number
  status: OrderStatus
  createdAt: string
}
