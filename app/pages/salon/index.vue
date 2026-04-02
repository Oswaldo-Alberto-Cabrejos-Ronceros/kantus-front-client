<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
      Pedidos en Salón
    </h1>

    <UTabs
      :items="items"
      class="w-full"
    >
      <!-- Iteramos dinámicamente sobre todas las categorías para generar su contenido en el tab correspondiente -->
      <template
        v-for="category in categories"
        :key="category.id"
        #[`category-${category.id}`]
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
          <ProductCard
            v-for="product in getProductsByCategory(category.id)"
            :id="product.id"
            :key="product.id"
            :name="product.name"
            :description="product.description"
            :price="product.price"
            :image-url="product.imageUrl"
            :quantity="orderStore.getRoomQuantity(product.id)"
            @update:quantity="orderStore.updateRoomQuantity(product as any, $event)"
          />
        </div>
      </template>
    </UTabs>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useMyOrderStore } from '~/stores/order'
import type { Category, Product } from '~/utils/types'

const orderStore = useMyOrderStore()

const { data: categories } = await useFetch<Category[]>('/api/categories')
const { data: products } = await useFetch<Product[]>('/api/products')

const items = computed(() => {
  return categories.value?.map(category => ({
    label: category.name,
    slot: `category-${category.id}`
  })) || []
})

const getProductsByCategory = (categoryId: number | string) => {
  return products.value?.filter(p => p.categoryId === categoryId) || []
}
</script>

<style>

</style>
