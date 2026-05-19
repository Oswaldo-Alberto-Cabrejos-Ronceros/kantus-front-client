import { getAllProducts } from '~/api/sdk.gen'
import { toProductUI } from '~/utils/adapters'
import type { Product } from '~/utils/types'

export function useProducts() {
  /**
   * Fetch all active products from the API and convert to UI types
   */
  const fetchAll = async (): Promise<Product[]> => {
    const { data } = await getAllProducts()
    if (!data) return []
    return data.map(toProductUI)
  }

  return { fetchAll }
}
