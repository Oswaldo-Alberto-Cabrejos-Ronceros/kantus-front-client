import { getAllCategories } from '~/api/sdk.gen'
import { toCategoryUI } from '~/utils/adapters'
import type { Category } from '~/utils/types'

export function useCategories() {
  /**
   * Fetch all active categories from the API and convert to UI types
   */
  const fetchAll = async (): Promise<Category[]> => {
    const { data } = await getAllCategories()
    if (!data) return []
    return data.map(toCategoryUI)
  }

  return { fetchAll }
}
