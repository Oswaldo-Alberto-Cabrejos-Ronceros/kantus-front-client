<script setup lang="ts">
import { computed } from 'vue'
import type { TrackedOrder } from '~/stores/order'
import type { OrderStatus } from '~/utils/types'

const props = defineProps<{ item: TrackedOrder }>()

const { useFindOrderByCode } = useOrders()
const { data: order, isPending } = useFindOrderByCode(() => props.item.code)

const statusLabel = computed(() => {
  if (isPending.value || !order.value) return '…'
  const labels: Record<OrderStatus, string> = {
    pending: 'Recibido',
    confirmed: 'Confirmado',
    preparing: 'Preparando',
    ready: 'Listo',
    delivered: props.item.type === 'delivery' ? 'En camino' : 'Entregado'
  }
  return labels[order.value.status] ?? order.value.status
})

const statusColor = computed<'neutral' | 'info' | 'warning' | 'success' | 'primary'>(() => {
  const map: Record<OrderStatus, 'neutral' | 'info' | 'warning' | 'success' | 'primary'> = {
    pending: 'neutral',
    confirmed: 'neutral',
    preparing: 'warning',
    ready: 'success',
    delivered: 'primary'
  }
  return order.value ? (map[order.value.status] ?? 'neutral') : 'neutral'
})
</script>

<template>
  <NuxtLink :to="`/seguimiento/${item.code}`" class="order-row">
    <div class="min-w-0">
      <p class="order-code">
        {{ item.code }}
      </p>
      <p class="order-type">
        {{ item.type === 'delivery' ? 'Delivery' : 'En salón' }}
      </p>
    </div>
    <UBadge :color="statusColor" variant="soft" size="sm">
      {{ statusLabel }}
    </UBadge>
    <UIcon name="i-lucide-chevron-right" class="text-gray-400 shrink-0" />
  </NuxtLink>
</template>

<style scoped>
.order-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 0.75rem;
  background: rgba(0, 0, 0, 0.015);
  transition: all 0.15s ease;
}

.order-row:hover {
  border-color: rgba(245, 158, 11, 0.4);
  background: rgba(245, 158, 11, 0.05);
}

:root.dark .order-row {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
}

.order-code {
  font-weight: 700;
  font-family: 'Courier New', monospace;
  color: #d97706;
  font-size: 0.95rem;
}

.order-type {
  font-size: 0.75rem;
  color: #9ca3af;
}

.order-row > .min-w-0 {
  flex: 1;
}
</style>
