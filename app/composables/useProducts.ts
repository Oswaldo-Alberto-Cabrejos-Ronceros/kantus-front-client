import { useQuery } from '@tanstack/vue-query'
import { getAllProducts } from '~/api/sdk.gen'
import { toProductUI } from '~/utils/adapters'
import type { Product } from '~/utils/types'

export function useProducts() {
  const useFindAllProducts = () => {
    return useQuery({
      queryKey: ['products'],
      queryFn: async (): Promise<Product[]> => {
        const { data } = await getAllProducts()
        if (!data) return []
        return data.map(toProductUI)
      }
    })
  }

  return { useFindAllProducts }
}
