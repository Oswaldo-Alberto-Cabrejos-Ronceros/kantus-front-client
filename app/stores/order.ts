import { defineStore } from 'pinia'
import type { ProductCard, Table, Order, OrderType } from '~/utils/types'

const STORAGE_KEY = 'kantus_last_order'

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

    resetOrderStatus() {
      this.orderStatus = 'idle'
      this.orderError = null
      this.lastOrder = null
    },

    /** Persiste lastOrder en localStorage (llamar después de crear un pedido exitoso) */
    persistLastOrder() {
      if (import.meta.client && this.lastOrder) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            order: this.lastOrder,
            savedAt: new Date().toISOString()
          }))
        } catch {}
      }
    },

    /** Hidrata lastOrder desde localStorage (llamar en el plugin de cliente) */
    hydrateFromStorage() {
      if (!import.meta.client) return
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return
        const parsed = JSON.parse(raw) as { order: Order; savedAt: string }
        // Solo restaurar pedidos de las últimas 24 horas
        const ageHours = (Date.now() - new Date(parsed.savedAt).getTime()) / 3_600_000
        if (ageHours < 24 && parsed.order) {
          this.lastOrder = parsed.order
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    },

    /** Borra el pedido guardado (cuando el cliente decide empezar otro) */
    clearSavedOrder() {
      this.lastOrder = null
      if (import.meta.client) {
        try { localStorage.removeItem(STORAGE_KEY) } catch {}
      }
    }
  }
})
