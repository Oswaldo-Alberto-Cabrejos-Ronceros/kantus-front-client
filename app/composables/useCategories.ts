import { useQuery } from '@tanstack/vue-query'
import { getAllCategories } from '~/api/sdk.gen'
import { toCategoryUI } from '~/utils/adapters'
import type { Category } from '~/utils/types'

export function useCategories() {
  const useFindAllCategories = () => {
    return useQuery({
      queryKey: ['categories'],
      queryFn: async (): Promise<Category[]> => {
        const { data } = await getAllCategories()
        if (!data) return []
        return data.map(toCategoryUI)
      }
    })
  }

  return { useFindAllCategories }
}
