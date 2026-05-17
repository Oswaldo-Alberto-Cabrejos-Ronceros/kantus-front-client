import type { CreateOrderRequest, Order } from '~/utils/types'

// Generador simple de ID de orden
function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `KNT-${timestamp}-${random}`
}

export default defineEventHandler(async (event): Promise<Order> => {
  const body = await readBody<CreateOrderRequest>(event)

  // Validaciones básicas del servidor
  if (!body || !body.type || !body.items || body.items.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Datos de orden incompletos'
    })
  }

  if (!['delivery', 'room'].includes(body.type)) {
    throw createError({
      statusCode: 400,
      message: 'Tipo de orden inválido'
    })
  }

  if (body.type === 'delivery' && (!body.customerName || !body.address || !body.phone)) {
    throw createError({
      statusCode: 400,
      message: 'Los datos de entrega son obligatorios para delivery'
    })
  }

  if (body.type === 'room' && !body.tableId) {
    throw createError({
      statusCode: 400,
      message: 'El ID de mesa es obligatorio para órdenes de salón'
    })
  }

  if (!body.paymentMethod || !['cash', 'card'].includes(body.paymentMethod)) {
    throw createError({
      statusCode: 400,
      message: 'Método de pago inválido'
    })
  }

  // Calcular totales
  const subtotal = body.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tip = body.tip || 0
  const total = subtotal + tip

  // Simular latencia de red y procesamiento
  await new Promise(resolve => setTimeout(resolve, 800))

  const order: Order = {
    id: generateOrderId(),
    type: body.type,
    tableId: body.tableId,
    tableNumber: body.tableId,
    customerName: body.customerName,
    address: body.address,
    phone: body.phone,
    paymentMethod: body.paymentMethod,
    items: body.items,
    subtotal,
    tip,
    total,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  }

  // En producción aquí se llamaría al backend externo:
  // const config = useRuntimeConfig()
  // const result = await $fetch(`${config.apiBaseUrl}/orders`, { method: 'POST', body: order })

  return order
})
