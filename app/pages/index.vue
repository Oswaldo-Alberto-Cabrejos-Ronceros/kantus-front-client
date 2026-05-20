<script setup lang="ts">
import { computed } from 'vue'
import { useMyOrderStore } from '~/stores/order'

definePageMeta({ layout: 'default' })

const orderStore = useMyOrderStore()

const { useFindAllCategories } = useCategories()
const { useFindAllProducts } = useProducts()

const { data: categories } = useFindAllCategories()
const { data: products } = useFindAllProducts()

const items = computed(() => {
  return categories.value?.map(category => ({
    label: category.name,
    slot: `category-${category.id}`
  })) || []
})

const getProductsByCategory = (categoryId: number) => {
  return products.value?.filter(p => p.categoryId === categoryId) || []
}

const deliveryTotal = computed(() => {
  if (!products.value) return 0
  return orderStore.deliveryOrder.reduce((sum, item) => {
    const product = products.value!.find(p => p.id === item.id)
    return sum + (product?.price || 0) * item.quantity
  }, 0)
})

const carouselItems = [
  'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1544025162-8315ea07b0c3?auto=format&fit=crop&w=1920&q=80'
]

useHead({ title: 'Kantus — Pedido Delivery' })
</script>

<template>
  <div class="page-delivery">
    <!-- Hero carousel -->
    <div class="hero-carousel">
      <UCarousel
        v-slot="{ item }"
        :items="carouselItems"
        indicators
        dots
        class="w-full"
        :ui="{ item: 'basis-full' }"
      >
        <div class="carousel-slide">
          <img
            :src="item"
            class="carousel-img"
            draggable="false"
            loading="lazy"
          >
          <div class="carousel-overlay">
            <div class="hero-content">
              <div class="hero-badge">
                <UIcon name="i-lucide-bike" />
                <span>Delivery disponible</span>
              </div>
              <h1 class="hero-title">
                El sabor que<br>
                <span class="hero-title-accent">mereces</span><br>
                en tu puerta
              </h1>
            </div>
          </div>
        </div>
      </UCarousel>
    </div>

    <!-- Contenido principal -->
    <div class="menu-section">
      <div class="menu-header">
        <h2 class="menu-title">
          Nuestro menú
        </h2>
        <p class="menu-subtitle">
          Selecciona los productos para tu pedido
        </p>
      </div>

      <UTabs
        :items="items"
        class="w-full"
      >
        <template
          v-for="category in categories"
          :key="category.id"
          #[`category-${category.id}`]
        >
          <div class="products-grid">
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

    <!-- Floating cart bar -->
    <SharedFloatingCartBar
      :item-count="orderStore.deliveryItemCount"
      :total="deliveryTotal"
      to="/pedido"
    />
  </div>
</template>

<style scoped>
.page-delivery {
  padding-bottom: 6rem; /* Espacio para la barra flotante */
}

/* Hero */
.hero-carousel {
  position: relative;
}

.carousel-slide {
  position: relative;
  height: 320px;
}

@media (min-width: 768px) {
  .carousel-slide {
    height: 420px;
  }
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.72) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.1) 100%
  );
  display: flex;
  align-items: center;
  padding: 2rem;
}

.hero-content {
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.875rem;
  background: rgba(59, 130, 246, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 9999px;
  color: white;
  font-size: 0.78rem;
  font-weight: 600;
  width: fit-content;
}

.hero-title {
  font-size: clamp(1.5rem, 4vw, 2.75rem);
  font-weight: 900;
  color: white;
  line-height: 1.15;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.hero-title-accent {
  color: #60a5fa;
}

/* Menu section */
.menu-section {
  padding: 2rem 1.5rem 1rem;
}

.menu-header {
  margin-bottom: 1.5rem;
}

.menu-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.02em;
}

:root.dark .menu-title {
  color: #f9fafb;
}

.menu-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.25rem;
  margin-top: 1.25rem;
}

@media (min-width: 480px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
