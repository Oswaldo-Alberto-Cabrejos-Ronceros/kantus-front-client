import type { Promotion } from '~/utils/types'

/**
 * Precio final de un producto aplicando su oferta activa.
 * Devuelve el precio base si no hay promoción o está inactiva.
 */
export function getEffectivePrice(price: number, promotion?: Promotion | null): number {
  if (!promotion || !promotion.status) return price
  if (promotion.tipo === 'porcentaje') return price * (1 - promotion.valor / 100)
  return Math.max(0, price - promotion.valor)
}

/** True si el producto tiene una oferta activa. */
export function hasActivePromotion(promotion?: Promotion | null): boolean {
  return !!promotion && promotion.status
}
