<template>
  <div class="confirmation-wrapper">
    <!-- Animación de check -->
    <div class="check-circle">
      <div class="check-ring check-ring-1" />
      <div class="check-ring check-ring-2" />
      <div class="check-icon-bg">
        <UIcon
          name="i-lucide-check"
          class="check-icon"
        />
      </div>
    </div>

    <!-- Contenido -->
    <div class="confirmation-content">
      <h2 class="confirmation-title">
        ¡Pedido Confirmado!
      </h2>
      <p class="confirmation-subtitle">
        Tu orden ha sido recibida y está siendo procesada
      </p>

      <!-- Código de orden -->
      <div class="order-id-card">
        <span class="order-id-label">Código de pedido</span>
        <span class="order-id-value">{{ order.code ?? order.id }}</span>
      </div>

      <!-- Detalles de la orden -->
      <div class="order-details">
        <!-- Mesa (si aplica) -->
        <div
          v-if="order.tableNumber"
          class="detail-row"
        >
          <div class="detail-icon-wrap">
            <UIcon name="i-lucide-utensils" />
          </div>
          <div class="detail-text">
            <span class="detail-label">Mesa</span>
            <span class="detail-value">Mesa #{{ order.tableNumber }}</span>
          </div>
        </div>

        <!-- Dirección delivery -->
        <div
          v-if="order.address"
          class="detail-row"
        >
          <div class="detail-icon-wrap">
            <UIcon name="i-lucide-map-pin" />
          </div>
          <div class="detail-text">
            <span class="detail-label">Dirección</span>
            <span class="detail-value">{{ order.address }}</span>
          </div>
        </div>

        <!-- Método de pago -->
        <div class="detail-row">
          <div class="detail-icon-wrap">
            <UIcon :name="order.paymentMethod === 'card' ? 'i-lucide-credit-card' : 'i-lucide-banknote'" />
          </div>
          <div class="detail-text">
            <span class="detail-label">Pago</span>
            <span class="detail-value">
              {{ order.paymentMethod === 'card' ? 'Tarjeta' : 'Efectivo' }}
            </span>
          </div>
        </div>

        <!-- Total -->
        <div class="detail-row">
          <div class="detail-icon-wrap">
            <UIcon name="i-lucide-receipt" />
          </div>
          <div class="detail-text">
            <span class="detail-label">Total</span>
            <span class="detail-value total-highlight">S/ {{ order.total.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Tiempo estimado -->
      <div class="eta-banner">
        <UIcon name="i-lucide-clock" />
        <span v-if="order.type === 'delivery'">Tiempo estimado de entrega: <strong>30-45 min</strong></span>
        <span v-else>Tu pedido estará listo en: <strong>15-20 min</strong></span>
      </div>

      <!-- Aviso de pedido guardado -->
      <div class="saved-notice">
        <UIcon name="i-lucide-bookmark-check" class="saved-icon" />
        <p>Tu código ha sido guardado en este dispositivo por 24 horas. Puedes volver a esta página cuando quieras.</p>
      </div>

      <!-- Boleta (disponible una vez procesado el pago) -->
      <div v-if="order.code" class="boleta-section">
        <div class="boleta-info">
          <UIcon name="i-lucide-receipt" class="boleta-icon" />
          <p>Tu boleta estará disponible una vez procesado el pago.</p>
        </div>
        <UButton
          size="sm"
          variant="outline"
          color="primary"
          icon="i-lucide-file-text"
          class="w-full"
          label="Ver boleta"
          :href="`${apiBaseUrl}/api/comprobantes/by-order/${order.code}/view`"
          target="_blank"
        />
      </div>

      <!-- Acciones -->
      <div class="confirmation-actions">
        <UButton
          v-if="backTo"
          :to="backTo"
          color="primary"
          size="lg"
          class="w-full"
          label="Hacer otro pedido"
          icon="i-lucide-plus-circle"
          @click="onNewOrder"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Order } from '~/utils/types'

defineProps<{
  order: Order
  backTo?: string
}>()

const emit = defineEmits<{
  (e: 'new-order'): void
}>()

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl as string

const store = useMyOrderStore()

function onNewOrder() {
  store.clearSavedOrder()
  emit('new-order')
}
</script>

<style scoped>
.confirmation-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  text-align: center;
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Check animado */
.check-circle {
  position: relative;
  width: 100px;
  height: 100px;
  margin-bottom: 1.5rem;
}

.check-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid transparent;
}

.check-ring-1 {
  border-color: #f59e0b;
  opacity: 0.3;
  animation: pulse-ring 2s ease-in-out infinite;
}

.check-ring-2 {
  border-color: #f59e0b;
  opacity: 0.15;
  animation: pulse-ring 2s ease-in-out infinite 0.5s;
  inset: -8px;
}

@keyframes pulse-ring {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.05); opacity: 0.1; }
}

.check-icon-bg {
  position: absolute;
  inset: 8px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);
  animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
}

@keyframes pop-in {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.check-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: #1c1c1c;
}

/* Content */
.confirmation-content {
  width: 100%;
  max-width: 480px;
}

.confirmation-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.confirmation-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

/* Order ID */
.order-id-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(217, 119, 6, 0.12));
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
}

.order-id-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.order-id-value {
  font-size: 1.1rem;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  color: #d97706;
  letter-spacing: 0.05em;
}

/* Details */
.order-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  text-align: left;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 0.625rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

:root.dark .detail-row {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.06);
}

.detail-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: rgba(245, 158, 11, 0.1);
  border-radius: 0.5rem;
  color: #d97706;
  flex-shrink: 0;
}

.detail-text {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.detail-label {
  font-size: 0.7rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.detail-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

:root.dark .detail-value {
  color: #f3f4f6;
}

.total-highlight {
  color: #d97706;
  font-size: 1rem;
}

/* ETA Banner */
.eta-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(245, 158, 11, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.15);
  border-radius: 0.625rem;
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.eta-banner strong {
  color: #d97706;
}

/* Saved notice */
.saved-notice {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  background: rgba(16, 185, 129, 0.06);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 0.625rem;
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.5;
  text-align: left;
  margin-bottom: 0.25rem;
}

.saved-icon {
  color: #10b981;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

/* Boleta */
.boleta-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.boleta-info {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  background: rgba(245, 158, 11, 0.05);
  border: 1px solid rgba(245, 158, 11, 0.15);
  border-radius: 0.625rem;
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.5;
  text-align: left;
}

.boleta-icon {
  color: #d97706;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

/* Actions */
.confirmation-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
