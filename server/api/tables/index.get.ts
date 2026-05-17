import type { Table } from '~/utils/types'

// Mock de mesas del restaurante
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

export default defineEventHandler((): Table[] => {
  return tables
})
