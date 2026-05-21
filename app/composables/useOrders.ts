import { useMutation } from '@tanstack/vue-query'
import { createOrder as apiCreateOrder } from '~/api/sdk.gen'
import { toOrderRequest, toOrderUI } from '~/utils/adapters'
import type { CreateOrderRequest, Order, OrderType } from '~/utils/types'
import { useMyOrderStore } from '~/stores/order'

export function useOrders() {
  const store = useMyOrderStore()

  const createOrderMutation = useMutation({
    mutationFn: async (uiRequest: CreateOrderRequest): Promise<Order> => {
      const apiRequest = toOrderRequest(uiRequest)
      const { data, error } = await apiCreateOrder({ body: apiRequest })

      if (error || !data) {
        const message = (error as any)?.message || (error as any)?.detail || 'Error al crear el pedido'
        throw new Error(message)
      }

      return toOrderUI(data)
    }
  })

  const useCreateOrder = () => createOrderMutation

  const submitOrder = async (payload: Omit<CreateOrderRequest, 'items'>) => {
    const type: OrderType = payload.type

    const cartItems = type === 'delivery'
      ? store.deliveryOrder
      : store.roomOrder

    if (cartItems.length === 0) {
      store.orderError = 'No hay productos en el carrito'
      return false
    }

    store.orderStatus = 'loading'
    store.orderError = null

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

      const order = await createOrderMutation.mutateAsync(orderRequest)

      store.lastOrder = order
      store.orderStatus = 'success'

      // Limpiar carrito correspondiente
      if (type === 'delivery') {
        store.clearDeliveryOrder()
      } else {
        store.clearRoomOrder()
      }

      return true
    } catch (err: any) {
      store.orderStatus = 'error'
      store.orderError = err?.data?.message || err?.message || 'Error al procesar el pedido'
      return false
    }
  }

  return {
    useCreateOrder,
    submitOrder
  }
}

