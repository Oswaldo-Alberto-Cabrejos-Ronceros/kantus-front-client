<script setup lang="ts">
import { computed, watch } from 'vue'
import { useMyOrderStore } from '~/stores/order'
import { getEffectivePrice } from '~/utils/pricing'

definePageMeta({ layout: 'room' })

const route = useRoute()
const orderStore = useMyOrderStore()
const tableId = Number(route.params.id)

// Fetch de la mesa con TanStack Vue Query
const { useFindOneTable } = useTables()
const { data: table, error: tableError, isLoading } = useFindOneTable(tableId)

// Si carga bien la mesa, la vinculamos al store
watch(table, (newTable) => {
  if (newTable) {
    orderStore.setTable(newTable)
  }
}, { immediate: true })

useHead({
  title: computed(() =>
    table.value ? `Kantus — Mesa #${table.value.number}` : 'Kantus — Mesa no encontrada'
  )
})

const { useFindAllCategories } = useCategories()
const { useFindAllProducts } = useProducts()

const dataCategories = useFindAllCategories()
const dataProducts = useFindAllProducts()

const categories = computed(() => dataCategories.data.value)
const products = computed(() => dataProducts.data.value)

const productsLoading = dataProducts.isPending

const offerProducts = computed(() =>
  products.value?.filter(p => p.status !== false && p.promotion?.status) || []
)

const tabItems = computed(() => {
  const base = categories.value?.map(category => ({
    label: category.name,
    slot: `category-${category.id}`
  })) || []
  return offerProducts.value.length
    ? [{ label: '🔥 Ofertas', slot: 'ofertas' }, ...base]
    : base
})

const getProductsByCategory = (categoryId: number | string) => {
  return products.value?.filter(p => p.categoryId === categoryId && p.status !== false) || []
}

const roomTotal = computed(() => {
  if (!products.value) return 0
  return orderStore.roomOrder.reduce((sum, item) => {
    const product = products.value!.find(p => p.id === item.id)
    return sum + getEffectivePrice(product?.price ?? 0, product?.promotion) * item.quantity
  }, 0)
})

const tableStatusLabel: Record<string, string> = {
  free: 'Disponible',
  occupied: 'Ocupada',
  reserved: 'Reservada'
}

const tableStatusClass: Record<string, string> = {
  free: 'status-free',
  occupied: 'status-occupied',
  reserved: 'status-reserved'
}
</script>

<template>
  <div>
    <!-- Cargando -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <UIcon name="i-lucide-loader-2" class="w-10 h-10 animate-spin text-primary" />
      <span class="text-sm text-gray-500 dark:text-gray-400">Cargando mesa...</span>
    </div>

    <!-- Mesa no encontrada -->
    <div
      v-else-if="tableError || !table"
      class="error-page"
    >
      <div class="error-icon">
        <UIcon name="i-lucide-table-2" />
      </div>
      <h1 class="error-title">
        Mesa no encontrada
      </h1>
      <p class="error-text">
        La mesa #{{ tableId }} no existe o el código QR es inválido.
        Por favor solicita ayuda al personal.
      </p>
      <UButton
        to="/"
        label="Ir a delivery"
        color="primary"
        icon="i-lucide-bike"
      />
    </div>

    <!-- Mesa encontrada -->
    <div
      v-else
      class="page-mesa"
    >
      <!-- Hero de mesa -->
      <div class="mesa-hero">
        <div class="mesa-hero-bg" />
        <div class="mesa-hero-content">
          <div class="mesa-number-badge">
            <UIcon name="i-lucide-utensils" />
            <span>Mesa #{{ table.number }}</span>
          </div>
          <h1 class="mesa-hero-title">
            Bienvenido a tu mesa
          </h1>
          <div class="mesa-info-chips">
            <span class="mesa-chip">
              <UIcon name="i-lucide-users" />
              {{ table.capacity }} personas
            </span>
            <span
              class="mesa-chip"
              :class="tableStatusClass[table.status]"
            >
              <span class="status-dot-sm" />
              {{ tableStatusLabel[table.status] }}
            </span>
          </div>
        </div>
      </div>

      <!-- Menú -->
      <div class="menu-section">
        <div class="menu-header">
          <h2 class="menu-title">
            Nuestro menú
          </h2>
          <p class="menu-subtitle">
            Selecciona lo que deseas pedir
          </p>
        </div>

        <!-- Skeleton de carga -->
        <div v-if="productsLoading" class="products-grid">
          <USkeleton v-for="n in 6" :key="n" class="h-72 w-full rounded-xl" />
        </div>

        <UTabs
          v-else
          :items="tabItems"
          class="w-full"
          :ui="{ list: 'sticky top-0 z-20 bg-default/95 backdrop-blur' }"
        >
          <template v-if="offerProducts.length" #ofertas>
            <div class="products-grid">
              <ProductCard
                v-for="product in offerProducts"
                :id="product.id"
                :key="product.id"
                :name="product.name"
                :description="product.description"
                :price="product.price"
                :promotion="product.promotion"
                :image-url="product.imageUrl"
                :quantity="orderStore.getRoomQuantity(product.id)"
                @update:quantity="orderStore.updateRoomQuantity(product as any, $event)"
              />
            </div>
          </template>
          <template
            v-for="category in categories"
            :key="category.id"
            #[`category-${category.id}`]
          >
            <div v-if="getProductsByCategory(category.id).length" class="products-grid">
              <ProductCard
                v-for="product in getProductsByCategory(category.id)"
                :id="product.id"
                :key="product.id"
                :name="product.name"
                :description="product.description"
                :price="product.price"
                :promotion="product.promotion"
                :image-url="product.imageUrl"
                :quantity="orderStore.getRoomQuantity(product.id)"
                @update:quantity="orderStore.updateRoomQuantity(product as any, $event)"
              />
            </div>
            <p v-else class="py-10 text-center text-sm text-gray-400">
              No hay productos disponibles en esta categoría.
            </p>
          </template>
        </UTabs>
      </div>

      <!-- Floating cart bar -->
      <SharedFloatingCartBar
        :item-count="orderStore.roomItemCount"
        :total="roomTotal"
        :to="`/mesa/${tableId}/pedido`"
        :table-number="table.number"
      />
    </div>
  </div>
</template>

<style scoped>
/* Error page */
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  text-align: center;
  gap: 1rem;
}

.error-icon {
  width: 5rem;
  height: 5rem;
  background: rgba(239, 68, 68, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
  font-size: 2rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
}

:root.dark .error-title {
  color: #f9fafb;
}

.error-text {
  font-size: 0.9rem;
  color: #6b7280;
  max-width: 380px;
  line-height: 1.6;
}

/* Page */
.page-mesa {
  padding-bottom: 6rem;
}

/* Hero de mesa */
.mesa-hero {
  position: relative;
  padding: 3rem 2rem 2.5rem;
  overflow: hidden;
}

.mesa-hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1c1917 0%, #451a03 50%, #7c2d12 100%);
  z-index: 0;
}

.mesa-hero-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=60') center/cover no-repeat;
  opacity: 0.15;
}

.mesa-hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 640px;
}

.mesa-number-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  background: rgba(245, 158, 11, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 9999px;
  color: white;
  font-size: 0.85rem;
  font-weight: 700;
  width: fit-content;
  letter-spacing: 0.02em;
}

.mesa-hero-title {
  font-size: clamp(1.75rem, 5vw, 3rem);
  font-weight: 900;
  color: white;
  line-height: 1.1;
  letter-spacing: -0.03em;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.mesa-info-chips {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.mesa-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3rem 0.875rem;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  color: white;
  font-size: 0.78rem;
  font-weight: 600;
}

.mesa-chip.status-free {
  background: rgba(16, 185, 129, 0.25);
  border-color: rgba(16, 185, 129, 0.4);
}

.mesa-chip.status-occupied {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.35);
}

.mesa-chip.status-reserved {
  background: rgba(245, 158, 11, 0.2);
  border-color: rgba(245, 158, 11, 0.35);
}

.status-dot-sm {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: currentColor;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Menu */
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
