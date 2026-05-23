import type {
  CategoryResponse,
  ProductResponse,
  RestaurantTableResponse,
  OrderResponse,
  OrderItemResponse,
  OrderRequest,
  OrderItemRequest
} from '~/api/types.gen'
import type {
  Category,
  Product,
  Table,
  Order,
  OrderItem,
  CreateOrderRequest,
  OrderType,
  OrderStatus,
  PaymentMethod
} from '~/utils/types'

// ─── Category ────────────────────────────────────────────────────────

export function toCategoryUI(api: CategoryResponse): Category {
  return {
    id: api.id,
    name: api.name
  }
}

// ─── Product ─────────────────────────────────────────────────────────

export function toProductUI(api: ProductResponse): Product {
  return {
    id: api.id ?? 0,
    categoryId: api.categoryId ?? 0,
    imageUrl: api.imageUrl ?? '',
    name: api.name ?? '',
    description: api.description ?? '',
    price: api.price ?? 0
  }
}

// ─── Table ───────────────────────────────────────────────────────────

function resolveTableStatus(api: RestaurantTableResponse): 'free' | 'occupied' | 'reserved' {
  if (api.occupied) return 'occupied'
  return 'free'
}

function parseTableNumber(name?: string): number {
  if (!name) return 0
  const parsed = parseInt(name.replace(/\D/g, ''), 10)
  return isNaN(parsed) ? 0 : parsed
}

export function toTableUI(api: RestaurantTableResponse): Table {
  return {
    id: api.id ?? 0,
    number: parseTableNumber(api.name),
    status: resolveTableStatus(api),
    capacity: api.capacity ?? 0
  }
}

// ─── Order ───────────────────────────────────────────────────────────

const ORDER_TYPE_MAP: Record<string, OrderType> = {
  SALON: 'room',
  DELIVERY: 'delivery'
}

const ORDER_TYPE_REVERSE_MAP: Record<OrderType, string> = {
  room: 'SALON',
  delivery: 'DELIVERY'
}

const ORDER_STATUS_MAP: Record<string, OrderStatus> = {
  PENDIENTE: 'pending',
  PREPARANDO: 'preparing',
  LISTO: 'ready',
  CAMINO: 'delivered',
  ENTREGADO: 'delivered',
  CANCELADO: 'delivered'
}

const PAYMENT_METHOD_MAP: Record<string, PaymentMethod> = {
  EFECTIVO: 'cash',
  TARJETA: 'card',
  YAPE: 'card',
  MERCADO_PAGO: 'card'
}

const PAYMENT_METHOD_REVERSE_MAP: Record<PaymentMethod, string> = {
  cash: 'EFECTIVO',
  card: 'TARJETA'
}

function toOrderItemUI(api: OrderItemResponse): OrderItem {
  return {
    productId: api.productId ?? 0,
    name: api.productName ?? '',
    price: api.priceUnitary ?? 0,
    quantity: api.quantity ?? 0,
    imageUrl: api.productImageUrl
  }
}

export function toOrderUI(api: OrderResponse): Order {
  const items = (api.items ?? []).map(toOrderItemUI)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return {
    id: String(api.id ?? ''),
    code: api.code ?? undefined,
    type: ORDER_TYPE_MAP[api.type ?? ''] ?? 'delivery',
    tableId: api.tableId ?? undefined,
    customerName: api.customerName ?? undefined,
    address: api.location ?? undefined,
    phone: api.customerPhone ?? undefined,
    paymentMethod: PAYMENT_METHOD_MAP[api.paymentMethod ?? ''] ?? 'cash',
    items,
    subtotal,
    tip: 0,
    total: api.totalPrice ?? subtotal,
    status: ORDER_STATUS_MAP[api.status ?? ''] ?? 'pending',
    createdAt: api.createdAt ?? new Date().toISOString()
  }
}

// ─── CreateOrderRequest → OrderRequest ───────────────────────────────

export function toOrderRequest(ui: CreateOrderRequest): OrderRequest {
  const apiItems: OrderItemRequest[] = ui.items.map(item => ({
    productId: item.productId,
    quantity: item.quantity
  }))

  return {
    type: ORDER_TYPE_REVERSE_MAP[ui.type] ?? 'DELIVERY',
    tableId: ui.tableId,
    customerName: ui.customerName,
    customerPhone: ui.phone,
    location: ui.address,
    paymentMethod: PAYMENT_METHOD_REVERSE_MAP[ui.paymentMethod] ?? 'EFECTIVO',
    items: apiItems
  }
}
