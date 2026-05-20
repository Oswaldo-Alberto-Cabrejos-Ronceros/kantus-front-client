import { useMutation } from '@tanstack/vue-query'
import { createOrder as apiCreateOrder } from '~/api/sdk.gen'
import { toOrderRequest, toOrderUI } from '~/utils/adapters'
import type { CreateOrderRequest, Order } from '~/utils/types'

export function useOrders() {
  const useCreateOrder = () => {
    return useMutation({
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
  }

  return { useCreateOrder }
}
