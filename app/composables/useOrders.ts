import { useMutation, useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { createOrder as apiCreateOrder, getOrderById } from '~/api/sdk.gen'
import { client } from '~/api/client.gen'
import type { OrderResponse } from '~/api/types.gen'
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
      store.persistLastOrder() // Guarda en localStorage para recuperar si el cliente navega
      store.addTrackedOrder(order) // Suma a "Mis pedidos" (permite seguir varios pedidos)

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

  /** Consulta un pedido por id y refresca su estado cada 15s (tracking en vivo) */
  const useFindOrder = (orderId: MaybeRefOrGetter<number | string | null | undefined>) => useQuery({
    queryKey: computed(() => ['order', toValue(orderId)]),
    enabled: computed(() => !!toValue(orderId)),
    refetchInterval: 15_000,
    queryFn: async (): Promise<Order> => {
      const { data, error } = await getOrderById({ path: { id: Number(toValue(orderId)) } })
      if (error || !data) throw new Error('No se pudo cargar el pedido')
      return toOrderUI(data)
    }
  })

  /** Consulta un pedido por código (ORD-XXXX) y refresca su estado cada 15s (seguimiento sin login) */
  const useFindOrderByCode = (code: MaybeRefOrGetter<string | null | undefined>) => useQuery({
    queryKey: computed(() => ['order-by-code', toValue(code)]),
    enabled: computed(() => !!toValue(code)),
    refetchInterval: 15_000,
    retry: false,
    queryFn: async (): Promise<Order> => {
      const res = await client.get({ url: `/api/orders/by-code/${toValue(code)}` })
      if (res.error || !res.data) throw new Error('Pedido no encontrado')
      return toOrderUI(res.data as OrderResponse)
    }
  })

  return {
    useCreateOrder,
    submitOrder,
    useFindOrder,
    useFindOrderByCode
  }
}

