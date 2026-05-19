import { createOrder as apiCreateOrder } from '~/api/sdk.gen'
import { toOrderRequest, toOrderUI } from '~/utils/adapters'
import type { CreateOrderRequest, Order } from '~/utils/types'

export function useOrders() {
  /**
   * Create a new order: converts UI request → API request, sends, then converts API response → UI order
   */
  const create = async (uiRequest: CreateOrderRequest): Promise<Order> => {
    const apiRequest = toOrderRequest(uiRequest)
    const { data, error } = await apiCreateOrder({ body: apiRequest })

    if (error || !data) {
      const message = (error as any)?.message || (error as any)?.detail || 'Error al crear el pedido'
      throw new Error(message)
    }

    return toOrderUI(data)
  }

  return { create }
}
