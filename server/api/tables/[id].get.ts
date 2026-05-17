import type { Table } from '~/utils/types'

// Mismo mock - en producción esto vendría del backend real
const tables: Table[] = [
  { id: 1, number: 1, status: 'free', capacity: 2 },
  { id: 2, number: 2, status: 'occupied', capacity: 4 },
  { id: 3, number: 3, status: 'free', capacity: 4 },
  { id: 4, number: 4, status: 'reserved', capacity: 6 },
  { id: 5, number: 5, status: 'free', capacity: 2 },
  { id: 6, number: 6, status: 'free', capacity: 8 },
  { id: 7, number: 7, status: 'occupied', capacity: 4 },
  { id: 8, number: 8, status: 'free', capacity: 4 },
  { id: 9, number: 9, status: 'free', capacity: 6 },
  { id: 10, number: 10, status: 'free', capacity: 2 }
]

export default defineEventHandler((event): Table => {
  const id = Number(getRouterParam(event, 'id'))

  if (isNaN(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      message: 'ID de mesa inválido'
    })
  }

  const table = tables.find(t => t.id === id)

  if (!table) {
    throw createError({
      statusCode: 404,
      message: `Mesa ${id} no encontrada`
    })
  }

  return table
})
