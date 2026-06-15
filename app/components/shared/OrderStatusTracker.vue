<template>
  <div class="status-tracker">
    <div
      v-for="(step, i) in steps"
      :key="step.key"
      class="status-step"
      :class="{ done: i <= currentIndex, current: i === currentIndex }"
    >
      <div class="status-dot">
        <UIcon :name="step.icon" />
      </div>
      <span class="status-label">{{ step.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { OrderStatus, OrderType } from '~/utils/types'

const props = defineProps<{
  status: OrderStatus
  type: OrderType
}>()

const steps = computed(() => [
  { key: 'pending', label: 'Recibido', icon: 'i-lucide-receipt-text' },
  { key: 'preparing', label: 'Preparando', icon: 'i-lucide-cooking-pot' },
  { key: 'ready', label: 'Listo', icon: 'i-lucide-bell-ring' },
  { key: 'delivered', label: props.type === 'delivery' ? 'En camino' : 'Servido', icon: 'i-lucide-check-check' }
])

const currentIndex = computed(() => {
  const i = steps.value.findIndex(s => s.key === props.status)
  return i < 0 ? 0 : i
})
</script>

<style scoped>
.status-tracker {
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 0 0.25rem;
}

.status-tracker::before {
  content: '';
  position: absolute;
  top: 1rem;
  left: 2.5rem;
  right: 2.5rem;
  height: 2px;
  background: rgba(0, 0, 0, 0.08);
  z-index: 0;
}

:root.dark .status-tracker::before {
  background: rgba(255, 255, 255, 0.1);
}

.status-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  position: relative;
  z-index: 1;
  flex: 1;
}

.status-dot {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  color: #9ca3af;
  transition: all 0.3s ease;
}

:root.dark .status-dot {
  background: #374151;
}

.status-step.done .status-dot {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #1c1c1c;
}

.status-step.current .status-dot {
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.25);
  animation: pulse-dot 1.6s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

.status-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #9ca3af;
}

.status-step.done .status-label {
  color: #d97706;
}
</style>
