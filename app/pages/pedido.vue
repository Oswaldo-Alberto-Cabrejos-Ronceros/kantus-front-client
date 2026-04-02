<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
      Completar orden
    </h1>

    <div
      v-if="orderItems.length === 0"
      class="text-gray-500 mb-6 dark:text-gray-400"
    >
      No hay productos en la orden de delivery.
    </div>

    <div
      v-else
      class="flex flex-col gap-4 mb-6"
    >
      <UCard
        v-for="item in orderItems"
        :key="item.id"
        :ui="{ body: 'p-4 sm:p-4' }"
      >
        <div class="flex items-center gap-4">
          <img
            :src="item.imageUrl"
            :alt="item.name"
            class="w-16 h-16 object-cover rounded-md"
          >
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 dark:text-white line-clamp-1">
              {{ item.name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Cantidad: {{ item.quantity }} x S/ {{ item.price?.toFixed(2) }}
            </p>
          </div>
          <div class="font-bold text-primary whitespace-nowrap">
            S/ {{ item.subtotal.toFixed(2) }}
          </div>
        </div>
      </UCard>

      <div class="text-right text-xl font-bold mt-4 text-gray-900 dark:text-white">
        Total: S/ {{ total.toFixed(2) }}
      </div>
    </div>

    <UButton
      size="lg"
      block
      label="Completar Pedido"
      color="primary"
      :disabled="orderItems.length === 0"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMyOrderStore } from '~/stores/order'
import type { Product } from '~/utils/types'

const orderStore = useMyOrderStore()
const { data: products } = await useFetch<Product[]>('/api/products')

const orderItems = computed(() => {
  if (!products.value) return []
  return orderStore.deliveryOrder.map((orderItem) => {
    const product = products.value!.find(p => p.id === orderItem.id)
    return {
      ...product,
      quantity: orderItem.quantity,
      subtotal: (product?.price || 0) * orderItem.quantity
    }
  }).filter(item => item.id !== undefined)
})

const total = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + item.subtotal, 0)
})
</script>
