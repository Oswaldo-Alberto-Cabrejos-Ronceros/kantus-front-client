<template>
  <div class="room-payment-form">
    <!-- Info de mesa -->
    <div
      v-if="tableNumber"
      class="table-info-card"
    >
      <div class="table-icon">
        <UIcon name="i-lucide-utensils" />
      </div>
      <div class="table-details">
        <span class="table-label">Mesa asignada</span>
        <span class="table-number">Mesa #{{ tableNumber }}</span>
      </div>
      <div class="table-status">
        <span class="status-dot" />
        <span>Activa</span>
      </div>
    </div>

    <!-- Total banner -->
    <div class="payment-total-banner">
      <span class="payment-total-label">Total a pagar</span>
      <span class="payment-total-amount">S/ {{ total.toFixed(2) }}</span>
    </div>

    <!-- Selección de método de pago -->
    <div class="payment-method-section">
      <p class="payment-method-label">
        Método de pago
      </p>
      <div class="payment-method-options">
        <button
          class="payment-method-btn"
          :class="{ active: selectedMethod === 'cash' }"
          type="button"
          @click="selectedMethod = 'cash'"
        >
          <UIcon name="i-lucide-banknote" />
          <span>Efectivo</span>
        </button>
        <button
          class="payment-method-btn"
          :class="{ active: selectedMethod === 'card' }"
          type="button"
          @click="selectedMethod = 'card'"
        >
          <UIcon name="i-lucide-credit-card" />
          <span>Tarjeta</span>
        </button>
      </div>
    </div>

    <!-- Datos de tarjeta (condicional) -->
    <Transition name="card-form">
      <UForm
        v-if="selectedMethod === 'card'"
        :schema="cardSchema"
        :state="cardState"
        class="card-form"
        @submit="onCardSubmit"
      >
        <UFormField
          label="Nombre en la tarjeta"
          name="fullName"
        >
          <UInput
            v-model="cardState.fullName"
            placeholder="JUAN GARCIA"
            icon="i-lucide-user"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Número de tarjeta"
          name="cardNumber"
        >
          <UInput
            v-model="cardState.cardNumber"
            placeholder="4242 4242 4242 4242"
            icon="i-lucide-credit-card"
            class="w-full"
            maxlength="16"
          />
        </UFormField>

        <div class="card-row">
          <UFormField
            label="Vencimiento"
            name="expiryDate"
          >
            <UInput
              v-model="cardState.expiryDate"
              placeholder="MM/AA"
              class="w-full"
              maxlength="5"
            />
          </UFormField>
          <UFormField
            label="CVV"
            name="cvv"
          >
            <UInput
              v-model="cardState.cvv"
              placeholder="123"
              class="w-full"
              maxlength="4"
              type="password"
            />
          </UFormField>
        </div>

        <UButton
          type="submit"
          size="lg"
          block
          color="primary"
          :loading="loading"
          label="Confirmar y pagar"
          icon="i-lucide-lock"
        />
      </UForm>

      <div
        v-else-if="selectedMethod === 'cash'"
        class="cash-info"
      >
        <div class="cash-notice">
          <UIcon name="i-lucide-info" />
          <p>El cobro se realizará directamente en tu mesa. El mozo se acercará a cobrarte.</p>
        </div>
        <UButton
          size="lg"
          block
          color="primary"
          :loading="loading"
          label="Confirmar pedido"
          icon="i-lucide-check-circle"
          @click="onCashSubmit"
        />
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import { cardSchema, type CardRequest } from '~/utils/validations'
import type { PaymentMethod } from '~/utils/types'

defineProps<{
  total: number
  tableNumber?: number
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', data: { paymentMethod: PaymentMethod; cardData?: CardRequest }): void
}>()

const selectedMethod = ref<PaymentMethod>('cash')

const cardState = reactive<Partial<CardRequest>>({
  fullName: undefined,
  cardNumber: undefined,
  cvv: undefined,
  expiryDate: undefined
})

function onCardSubmit(event: FormSubmitEvent<CardRequest>) {
  emit('submit', { paymentMethod: 'card', cardData: event.data })
}

function onCashSubmit() {
  emit('submit', { paymentMethod: 'cash' })
}
</script>

<style scoped>
.room-payment-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Table info */
.table-info-card {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.125rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.12));
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 0.75rem;
}

.table-icon {
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

.table-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.table-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table-number {
  font-size: 0.95rem;
  font-weight: 700;
  color: #059669;
}

.table-status {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #10b981;
  font-weight: 500;
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  background: #10b981;
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Total banner */
.payment-total-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #1c1c1c, #262626);
  border-radius: 0.875rem;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.payment-total-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
}

.payment-total-amount {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
}

/* Method selection */
.payment-method-section {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.payment-method-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.payment-method-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.payment-method-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid rgba(0, 0, 0, 0.08);
  border-radius: 0.75rem;
  background: rgba(0, 0, 0, 0.02);
  color: #6b7280;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

:root.dark .payment-method-btn {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #9ca3af;
}

.payment-method-btn:hover {
  border-color: #f59e0b;
  color: #d97706;
  background: rgba(245, 158, 11, 0.05);
}

.payment-method-btn.active {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.08);
  color: #d97706;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.card-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: fadeIn 0.3s ease;
}

.card-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.cash-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: fadeIn 0.3s ease;
}

.cash-notice {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(245, 158, 11, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.15);
  border-radius: 0.625rem;
  color: #6b7280;
  font-size: 0.85rem;
  line-height: 1.5;
}

.card-form-enter-active,
.card-form-leave-active {
  transition: all 0.25s ease;
}

.card-form-enter-from,
.card-form-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
