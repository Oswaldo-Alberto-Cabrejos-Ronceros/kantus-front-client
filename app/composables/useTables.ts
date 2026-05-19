import { getTableById } from '~/api/sdk.gen'
import { toTableUI } from '~/utils/adapters'
import type { Table } from '~/utils/types'

export function useTables() {
  /**
   * Fetch a single table by ID and convert to UI type
   */
  const fetchById = async (id: number): Promise<Table | null> => {
    try {
      const { data } = await getTableById({ path: { id } })
      if (!data) return null
      return toTableUI(data)
    } catch {
      return null
    }
  }

  return { fetchById }
}
