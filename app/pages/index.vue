<script setup lang="ts">
import { computed } from 'vue'
import { useMyOrderStore } from '~/stores/order'
import type { Category, Product } from '~/utils/types'

const orderStore = useMyOrderStore()

// Obtenemos las categorías y los productos desde los endpoints
const { data: categories } = await useFetch<Category[]>('/api/categories')
const { data: products } = await useFetch<Product[]>('/api/products')

// Transformamos las categorías al formato de items que requiere UTabs con slots dinámicos
const items = computed(() => {
  return categories.value?.map(category => ({
    label: category.name,
    slot: `category-${category.id}` // ej. 'category-1', 'category-2'
  })) || []
})

// Filtrar los productos dependiendo de la categoría actual de la pestaña
const getProductsByCategory = (categoryId: number) => {
  return products.value?.filter(p => p.categoryId === categoryId) || []
}

const carouselItems = [
  'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1544025162-8315ea07b0c3?auto=format&fit=crop&w=1920&q=80'
]
</script>

<template>
  <div class="w-full">
    <!-- Carrusel ocupando todo el ancho -->
    <UCarousel
      v-slot="{ item }"
      :items="carouselItems"
      indicators
      dots
      class="w-full mx-auto"
      :ui="{ item: 'basis-full' }"
    >
      <img
        :src="item"
        class="w-full h-64 md:h-96 object-cover"
        draggable="false"
        loading="lazy"
      >
    </UCarousel>

    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Pedidos en Delivery
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
              :quantity="orderStore.getDeliveryQuantity(product.id)"
              @update:quantity="orderStore.updateDeliveryQuantity(product as any, $event)"
            />
          </div>
        </template>
      </UTabs>
    </div>
  </div>
</template>
