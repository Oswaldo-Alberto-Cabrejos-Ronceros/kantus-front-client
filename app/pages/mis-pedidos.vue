<script setup lang="ts">
import { onMounted } from 'vue'
import { useMyOrderStore } from '~/stores/order'

definePageMeta({ layout: 'default' })

const store = useMyOrderStore()

onMounted(() => store.loadTrackedOrders())

useHead({ title: 'Kantus — Mis pedidos' })
</script>

<template>
  <div class="my-orders">
    <div class="my-orders-head">
      <h1 class="my-orders-title">
        Mis pedidos
      </h1>
      <p class="my-orders-sub">
        Pedidos hechos desde este dispositivo (últimas 48 h)
      </p>
    </div>

    <!-- Vacío -->
    <div v-if="!store.trackedOrders.length" class="empty-state">
      <UIcon name="i-lucide-receipt" class="w-12 h-12 text-gray-300" />
      <p class="text-sm text-gray-500">
        Aún no tienes pedidos recientes.
      </p>
      <UButton to="/" color="primary" icon="i-lucide-utensils" label="Hacer un pedido" />
    </div>

    <!-- Lista -->
    <div v-else class="orders-list">
      <SharedTrackedOrderRow
        v-for="o in store.trackedOrders"
        :key="o.code"
        :item="o"
      />
    </div>
  </div>
</template>

<style scoped>
.my-orders {
  padding: 1.5rem 1rem 4rem;
  max-width: 480px;
  margin: 0 auto;
}

.my-orders-head {
  margin-bottom: 1.25rem;
}

.my-orders-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.02em;
}

:root.dark .my-orders-title {
  color: #f9fafb;
}

.my-orders-sub {
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 0.2rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  text-align: center;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}
</style>
