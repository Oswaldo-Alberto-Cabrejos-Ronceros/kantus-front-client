import { useQuery } from '@tanstack/vue-query'
import type { MaybeRef } from 'vue'
import { computed, toValue } from 'vue'
import { getTableById } from '~/api/sdk.gen'
import { toTableUI } from '~/utils/adapters'
import type { Table } from '~/utils/types'

export function useTables() {
  const useFindOneTable = (id: MaybeRef<number>) => {
    return useQuery({
      queryKey: ['tables', id],
      queryFn: async (): Promise<Table | null> => {
        const { data, error } = await getTableById({ path: { id: toValue(id) } })
        if (error || !data) {
          throw new Error('Table not found')
        }
        return toTableUI(data)
      },
      enabled: computed(() => !!toValue(id))
    })
  }

  return { useFindOneTable }
}
