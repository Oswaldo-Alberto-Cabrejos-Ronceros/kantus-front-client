<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({ layout: 'default' })

const route = useRoute()
const code = computed(() => String(route.params.code || ''))

const { useFindOrderByCode } = useOrders()
const { data: order, isPending, isError } = useFindOrderByCode(code)

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl as string

useHead({ title: 'Kantus — Seguimiento del pedido' })

function formatPrice(v: number) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(v)
}
</script>

<template>
  <div class="track-page">
    <!-- Cargando -->
    <div v-if="isPending" class="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <UIcon name="i-lucide-loader-2" class="w-9 h-9 animate-spin text-primary" />
      <span class="text-sm text-gray-500">Cargando tu pedido…</span>
    </div>

    <!-- No encontrado -->
    <div
      v-else-if="isError || !order"
      class="flex flex-col items-center justify-center min-h-[60vh] gap-3 px-6 text-center"
    >
      <UIcon name="i-lucide-search-x" class="w-12 h-12 text-gray-300" />
      <h1 class="text-lg font-bold">
        Pedido no encontrado
      </h1>
      <p class="text-sm text-gray-500">
        No encontramos el pedido <strong>{{ code }}</strong>. Verifica el código.
      </p>
      <UButton to="/" color="primary" icon="i-lucide-home" label="Ir al inicio" />
    </div>

    <!-- Seguimiento -->
    <div v-else class="track-card">
      <div class="track-head">
        <span class="track-label">Pedido</span>
        <span class="track-code">{{ order.code }}</span>
      </div>

      <SharedOrderStatusTracker :status="order.status" :type="order.type" />

      <div class="track-items">
        <div v-for="item in order.items" :key="item.productId" class="track-item">
          <span class="text-gray-700 dark:text-gray-200">{{ item.quantity }}× {{ item.name }}</span>
          <span class="font-semibold">{{ formatPrice(item.price * item.quantity) }}</span>
        </div>
      </div>

      <div class="track-total">
        <span>Total</span>
        <span class="text-primary">{{ formatPrice(order.total) }}</span>
      </div>

      <UButton
        v-if="order.code"
        :href="`${apiBaseUrl}/api/comprobantes/by-order/${order.code}/view`"
        target="_blank"
        variant="outline"
        color="primary"
        icon="i-lucide-file-text"
        label="Ver boleta"
        class="w-full justify-center"
      />

      <UButton
        to="/mis-pedidos"
        variant="ghost"
        color="neutral"
        icon="i-lucide-list"
        label="Ver todos mis pedidos"
        class="w-full justify-center"
      />
    </div>
  </div>
</template>

<style scoped>
.track-page {
  padding: 1.5rem 1rem 4rem;
  max-width: 480px;
  margin: 0 auto;
}

.track-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.track-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(217, 119, 6, 0.12));
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 0.75rem;
}

.track-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  font-weight: 600;
}

.track-code {
  font-size: 1.2rem;
  font-weight: 800;
  font-family: 'Courier New', monospace;
  color: #d97706;
}

.track-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.track-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.track-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: 800;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding-top: 0.75rem;
}
</style>
