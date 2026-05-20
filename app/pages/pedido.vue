<template>
  <div class="checkout-page">
    <!-- Confirmation screen -->
    <SharedOrderConfirmation
      v-if="orderStore.orderStatus === 'success' && orderStore.lastOrder"
      :order="orderStore.lastOrder"
      back-to="/"
      @new-order="orderStore.resetOrderStatus()"
    />

    <!-- Checkout flow -->
    <template v-else>
      <div class="checkout-header">
        <NuxtLink
          to="/"
          class="back-link"
        >
          <UIcon name="i-lucide-arrow-left" />
          <span>Seguir comprando</span>
        </NuxtLink>
        <h1 class="checkout-title">
          Confirmar pedido
        </h1>
        <p class="checkout-subtitle">
          Delivery — {{ orderItems.length }} {{ orderItems.length === 1 ? 'producto' : 'productos' }}
        </p>
      </div>

      <!-- Stepper -->
      <UStepper
        v-model="currentStep"
        :items="stepperItems"
        class="checkout-stepper"
      >
        <!-- Paso 1: Resumen del pedido -->
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
                Agrega productos desde el menú para continuar
              </p>
              <UButton
                to="/"
                label="Ir al menú"
                color="primary"
                icon="i-lucide-arrow-left"
              />
            </div>

            <template v-else>
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
                <div class="summary-row">
                  <span>Delivery</span>
                  <span class="text-green-600 dark:text-green-400 font-medium">Gratis</span>
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
                label="Continuar"
                trailing-icon="i-lucide-arrow-right"
                @click="currentStep = 1"
              />
            </template>
          </div>
        </template>

        <!-- Paso 2: Datos de entrega -->
        <template #entrega>
          <div class="step-content">
            <DeliveryFormDeliveryData
              @submit="onDeliveryDataSubmit"
            />
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

        <!-- Paso 3: Pago -->
        <template #pago>
          <div class="step-content">
            <DeliveryFormPayer
              :total="total"
              :loading="orderStore.orderStatus === 'loading'"
              @submit="onPaymentSubmit"
            />

            <!-- Error de orden -->
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
              label="Volver a datos de entrega"
              icon="i-lucide-arrow-left"
              @click="currentStep = 1"
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
import type { DeliveryDataRequest } from '~/utils/validations'

definePageMeta({ layout: 'default' })
useHead({ title: 'Kantus — Confirmar Pedido Delivery' })

const orderStore = useMyOrderStore()
const { useFindAllProducts } = useProducts()
const { data: products } = useFindAllProducts()

const currentStep = ref(0)
const deliveryData = ref<DeliveryDataRequest | null>(null)

const stepperItems: StepperItem[] = [
  {
    slot: 'pedido' as const,
    label: 'Pedido',
    description: 'Revisa tu orden'
  },
  {
    slot: 'entrega' as const,
    label: 'Entrega',
    description: 'Datos de delivery'
  },
  {
    slot: 'pago' as const,
    label: 'Pago',
    description: 'Método de pago'
  }
]

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

const total = computed(() =>
  orderItems.value.reduce((sum, item) => sum + item.subtotal, 0)
)

function onDeliveryDataSubmit(data: DeliveryDataRequest) {
  deliveryData.value = data
  currentStep.value = 2
}

async function onPaymentSubmit(paymentData: { paymentMethod: 'cash' | 'card' }) {
  if (!deliveryData.value) return

  await orderStore.submitOrder({
    type: 'delivery',
    paymentMethod: paymentData.paymentMethod,
    customerName: deliveryData.value.customerName,
    address: deliveryData.value.address,
    phone: deliveryData.value.phone
  })
}
</script>

<style scoped>
.checkout-page {
  max-width: 680px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

/* Header */
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
  color: #d97706;
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
}

/* Stepper */
.checkout-stepper {
  width: 100%;
}

/* Step content */
.step-content {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Empty cart */
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
  background: rgba(245, 158, 11, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d97706;
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

/* Order items */
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
  border-color: rgba(245, 158, 11, 0.25);
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
  color: #d97706;
  white-space: nowrap;
}

/* Summary footer */
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

/* Error */
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
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
