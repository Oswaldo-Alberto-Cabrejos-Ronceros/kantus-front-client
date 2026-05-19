import { defineStore } from 'pinia'
import type { ProductCard, Table, Order, CreateOrderRequest, OrderType } from '~/utils/types'

export type OrderStoreStatus = 'idle' | 'loading' | 'success' | 'error'

export const useMyOrderStore = defineStore('myOrderStore', {
  state: () => ({
    // Carrito de delivery
    deliveryOrder: [] as ProductCard[],
    // Carrito de salón/mesa
    roomOrder: [] as ProductCard[],
    // Mesa activa (cuando el cliente accede via QR /mesa/:id)
    activeTable: null as Table | null,
    // Estado del submit
    orderStatus: 'idle' as OrderStoreStatus,
    orderError: null as string | null,
    lastOrder: null as Order | null
  }),

  getters: {
    // Delivery
    getDeliveryQuantity: state => (id: number) => {
      const item = state.deliveryOrder.find(p => p.id === id)
      return item ? item.quantity : 0
    },
    deliveryItemCount: (state) => {
      return state.deliveryOrder.reduce((sum, item) => sum + item.quantity, 0)
    },

    // Salón / Mesa
    getRoomQuantity: state => (id: number) => {
      const item = state.roomOrder.find(p => p.id === id)
      return item ? item.quantity : 0
    },
    roomItemCount: (state) => {
      return state.roomOrder.reduce((sum, item) => sum + item.quantity, 0)
    },

    // Mesa activa
    hasActiveTable: (state) => state.activeTable !== null
  },

  actions: {
    // --- Delivery ---
    updateDeliveryQuantity(product: ProductCard, quantity: number) {
      const item = this.deliveryOrder.find(p => p.id === product.id)
      if (item) {
        if (quantity <= 0) {
          this.deliveryOrder = this.deliveryOrder.filter(p => p.id !== product.id)
        } else {
          item.quantity = quantity
        }
      } else if (quantity > 0) {
        this.deliveryOrder.push({ ...product, quantity })
      }
    },
    clearDeliveryOrder() {
      this.deliveryOrder = []
    },

    // --- Salón ---
    updateRoomQuantity(product: ProductCard, quantity: number) {
      const item = this.roomOrder.find(p => p.id === product.id)
      if (item) {
        if (quantity <= 0) {
          this.roomOrder = this.roomOrder.filter(p => p.id !== product.id)
        } else {
          item.quantity = quantity
        }
      } else if (quantity > 0) {
        this.roomOrder.push({ ...product, quantity })
      }
    },
    clearRoomOrder() {
      this.roomOrder = []
    },

    // --- Mesa ---
    setTable(table: Table) {
      this.activeTable = table
    },
    clearTable() {
      this.activeTable = null
    },

    // --- Submit Order ---
    async submitOrder(payload: Omit<CreateOrderRequest, 'items'>) {
      const type: OrderType = payload.type

      const cartItems = type === 'delivery'
        ? this.deliveryOrder
        : this.roomOrder

      if (cartItems.length === 0) {
        this.orderError = 'No hay productos en el carrito'
        return false
      }

      this.orderStatus = 'loading'
      this.orderError = null

      try {
        const orderRequest: CreateOrderRequest = {
          ...payload,
          items: cartItems.map(item => ({
            productId: item.id,
            name: (item as any).name || '',
            price: (item as any).price || 0,
            quantity: item.quantity,
            imageUrl: (item as any).imageUrl
          }))
        }

        const { create: createOrder } = useOrders()
        const order = await createOrder(orderRequest)

        this.lastOrder = order
        this.orderStatus = 'success'

        // Limpiar carrito correspondiente
        if (type === 'delivery') {
          this.clearDeliveryOrder()
        } else {
          this.clearRoomOrder()
        }

        return true
      } catch (err: any) {
        this.orderStatus = 'error'
        this.orderError = err?.data?.message || err?.message || 'Error al procesar el pedido'
        return false
      }
    },

    resetOrderStatus() {
      this.orderStatus = 'idle'
      this.orderError = null
      this.lastOrder = null
    }
  }
})
