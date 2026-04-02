import { defineStore } from 'pinia'
import type { ProductCard } from '~/utils/types'

export const useMyOrderStore = defineStore(
  'myOrderStore', {
    state: () => ({
      deliveryOrder: [] as ProductCard[],
      roomOrder: [] as ProductCard[]
    }),
    getters: {
      getDeliveryQuantity: state => (id: number) => {
        const item = state.deliveryOrder.find(p => p.id === id)
        return item ? item.quantity : 0
      },
      getRoomQuantity: state => (id: number) => {
        const item = state.roomOrder.find(p => p.id === id)
        return item ? item.quantity : 0
      }
    },
    actions: {
      updateDeliveryQuantity(product: ProductCard, quantity: number) {
        const item = this.deliveryOrder.find(p => p.id === product.id)
        if (item) {
          if (quantity <= 0) {
            this.deliveryOrder = this.deliveryOrder.filter(p => p.id !== product.id)
          } else {
            item.quantity = quantity
          }
        } else if (quantity > 0) {
        // CORRECCIÓN: Pasamos el objeto completo o aseguramos que cumpla con ProductCard
          this.deliveryOrder.push({ ...product, quantity })
        }
      },
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
      }
    } }
)
