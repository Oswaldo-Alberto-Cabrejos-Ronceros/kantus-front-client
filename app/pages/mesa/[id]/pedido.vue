<template>
  <div class="checkout-page">
    <!-- Confirmation screen -->
    <SharedOrderConfirmation
      v-if="orderStore.orderStatus === 'success' && orderStore.lastOrder"
      :order="orderStore.lastOrder"
      :back-to="`/mesa/${tableId}`"
      @new-order="orderStore.resetOrderStatus()"
    />

    <!-- Checkout flow -->
    <template v-else>
      <div class="checkout-header">
        <NuxtLink
          :to="`/mesa/${tableId}`"
          class="back-link"
        >
          <UIcon name="i-lucide-arrow-left" />
          <span>Seguir agregando</span>
        </NuxtLink>
        <h1 class="checkout-title">
          Confirmar pedido
        </h1>
        <p class="checkout-subtitle">
          <span
            v-if="orderStore.activeTable"
            class="mesa-badge"
          >Mesa #{{ orderStore.activeTable.number }}</span>
          — {{ orderItems.length }} {{ orderItems.length === 1 ? 'producto' : 'productos' }}
        </p>
      </div>

      <UStepper
        v-model="currentStep"
        :items="stepperItems"
        class="checkout-stepper"
      >
        <!-- Paso 1: Resumen -->
        <template #pedido>
          <div class="step-content">
            <div
              v-if="orderItems.length === 0"
              class="empty-cart"
            >
              <div class="empty-cart-icon">
                <UIcon name="i-lucide-shopping-basket" />
              </div>
              <h3 class="empty-cart-title">
                Tu carrito está vacío
              </h3>
              <p class="empty-cart-text">
                Agrega productos desde el menú
              </p>
              <UButton
                :to="`/mesa/${tableId}`"
                label="Ir al menú"
                color="primary"
                icon="i-lucide-arrow-left"
              />
            </div>

            <template v-else>
              <!-- Mesa info -->
              <div
                v-if="orderStore.activeTable"
                class="mesa-info-card"
              >
                <div class="mesa-icon">
                  <UIcon name="i-lucide-utensils" />
                </div>
                <div>
                  <p class="mesa-label">
                    Tu mesa
                  </p>
                  <p class="mesa-number">
                    Mesa #{{ orderStore.activeTable.number }}
                  </p>
                </div>
                <div class="mesa-capacity">
                  <UIcon name="i-lucide-users" />
                  <span>{{ orderStore.activeTable.capacity }} personas</span>
                </div>
              </div>

              <div class="order-items">
                <div
                  v-for="item in orderItems"
                  :key="item.id"
                  class="order-item"
                >
                  <img
                    :src="item.imageUrl"
                    :alt="item.name"
                    class="order-item-img"
                  >
                  <div class="order-item-info">
                    <h3 class="order-item-name">
                      {{ item.name }}
                    </h3>
                    <p class="order-item-qty">
                      {{ item.quantity }} × S/ {{ item.price?.toFixed(2) }}
                    </p>
                  </div>
                  <div class="order-item-subtotal">
                    S/ {{ item.subtotal.toFixed(2) }}
                  </div>
                </div>
              </div>

              <div class="order-summary-footer">
                <div class="summary-row">
                  <span>Subtotal</span>
                  <span>S/ {{ total.toFixed(2) }}</span>
                </div>
                <div class="summary-row summary-total">
                  <span>Total</span>
                  <span>S/ {{ total.toFixed(2) }}</span>
                </div>
              </div>

              <UButton
                size="lg"
                block
                color="primary"
                label="Continuar al pago"
                trailing-icon="i-lucide-arrow-right"
                @click="currentStep = 1"
              />
            </template>
          </div>
        </template>

        <!-- Paso 2: Pago -->
        <template #pago>
          <div class="step-content">
            <RoomFormPayment
              :total="total"
              :table-number="orderStore.activeTable?.number"
              :loading="orderStore.orderStatus === 'loading'"
              @submit="onPaymentSubmit"
            />

            <div
              v-if="orderStore.orderStatus === 'error' && orderStore.orderError"
              class="order-error"
            >
              <UIcon name="i-lucide-alert-circle" />
              <span>{{ orderStore.orderError }}</span>
            </div>

            <UButton
              class="mt-3"
              size="md"
              variant="ghost"
              color="neutral"
              label="Volver al resumen"
              icon="i-lucide-arrow-left"
              @click="currentStep = 0"
            />
          </div>
        </template>
      </UStepper>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { StepperItem } from '@nuxt/ui'
import { useMyOrderStore } from '~/stores/order'
import type { Product } from '~/utils/types'

definePageMeta({ layout: 'room' })

const route = useRoute()
const tableId = Number(route.params.id)
const orderStore = useMyOrderStore()

useHead({
  title: computed(() =>
    orderStore.activeTable
      ? `Kantus — Pedido Mesa #${orderStore.activeTable.number}`
      : 'Kantus — Confirmar Pedido'
  )
})

const { data: products } = await useFetch<Product[]>('/api/products')
const currentStep = ref(0)

const stepperItems: StepperItem[] = [
  {
    slot: 'pedido' as const,
    label: 'Pedido',
    description: 'Revisa tu orden'
  },
  {
    slot: 'pago' as const,
    label: 'Pago',
    description: 'Método de pago'
  }
]

const orderItems = computed(() => {
  if (!products.value) return []
  return orderStore.roomOrder.map((orderItem) => {
    const product = products.value!.find(p => p.id === orderItem.id)
    return {
      ...product,
      quantity: orderItem.quantity,
      subtotal: (product?.price || 0) * orderItem.quantity
    }
  }).filter(item => item.id !== undefined)
})

const total = computed(() =>
  orderItems.value.reduce((sum, item) => sum + item.subtotal, 0)
)

async function onPaymentSubmit(paymentData: { paymentMethod: 'cash' | 'card' }) {
  await orderStore.submitOrder({
    type: 'room',
    paymentMethod: paymentData.paymentMethod,
    tableId: orderStore.activeTable?.id || tableId
  })
}
</script>

<style scoped>
.checkout-page {
  max-width: 680px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

.checkout-header {
  margin-bottom: 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.85rem;
  color: #6b7280;
  text-decoration: none;
  margin-bottom: 1rem;
  transition: color 0.15s;
}

.back-link:hover {
  color: #10b981;
}

.checkout-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.02em;
}

:root.dark .checkout-title {
  color: #f9fafb;
}

.checkout-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.mesa-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.625rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 9999px;
  color: #059669;
  font-size: 0.78rem;
  font-weight: 700;
}

:root.dark .mesa-badge {
  color: #34d399;
}

.checkout-stepper {
  width: 100%;
}

.step-content {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
  text-align: center;
  gap: 1rem;
}

.empty-cart-icon {
  width: 4rem;
  height: 4rem;
  background: rgba(16, 185, 129, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
  font-size: 1.5rem;
}

.empty-cart-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
}

:root.dark .empty-cart-title {
  color: #f9fafb;
}

.empty-cart-text {
  font-size: 0.875rem;
  color: #6b7280;
}

.mesa-info-card {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.125rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.12));
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 0.75rem;
}

.mesa-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 0.5rem;
  color: white;
  flex-shrink: 0;
}

.mesa-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mesa-number {
  font-size: 0.95rem;
  font-weight: 700;
  color: #059669;
}

:root.dark .mesa-number {
  color: #34d399;
}

.mesa-capacity {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-left: auto;
  font-size: 0.78rem;
  color: #6b7280;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 0.75rem;
  transition: border-color 0.15s;
}

:root.dark .order-item {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.06);
}

.order-item:hover {
  border-color: rgba(16, 185, 129, 0.2);
}

.order-item-img {
  width: 3.5rem;
  height: 3.5rem;
  object-fit: cover;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.order-item-info {
  flex: 1;
  min-width: 0;
}

.order-item-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:root.dark .order-item-name {
  color: #f3f4f6;
}

.order-item-qty {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.125rem;
}

.order-item-subtotal {
  font-size: 0.95rem;
  font-weight: 700;
  color: #059669;
  white-space: nowrap;
}

.order-summary-footer {
  padding: 1rem 1.25rem;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

:root.dark .order-summary-footer {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.06);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6b7280;
}

.summary-total {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-top: 0.5rem;
  margin-top: 0.25rem;
}

:root.dark .summary-total {
  color: #f9fafb;
  border-color: rgba(255, 255, 255, 0.06);
}

.order-error {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 1rem;
  background: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 0.625rem;
  color: #ef4444;
  font-size: 0.85rem;
}
</style>
