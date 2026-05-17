<template>
  <Transition name="cart-bar">
    <div
      v-if="itemCount > 0"
      class="floating-cart-bar"
    >
      <div class="cart-bar-inner">
        <!-- Lado izquierdo: ícono + cantidad -->
        <div class="cart-bar-left">
          <div class="cart-icon-wrapper">
            <UIcon
              name="i-lucide-shopping-basket"
              class="cart-icon"
            />
            <span class="cart-badge">{{ itemCount }}</span>
          </div>
          <div class="cart-bar-info">
            <span class="cart-bar-label">
              {{ itemCount }} {{ itemCount === 1 ? 'producto' : 'productos' }}
            </span>
            <span
              v-if="tableNumber"
              class="cart-bar-table"
            >Mesa {{ tableNumber }}</span>
          </div>
        </div>

        <!-- Centro: total -->
        <div class="cart-bar-total">
          S/ {{ total.toFixed(2) }}
        </div>

        <!-- Lado derecho: botón -->
        <NuxtLink
          :to="to"
          class="cart-bar-btn"
        >
          Ver pedido
          <UIcon
            name="i-lucide-arrow-right"
            class="btn-arrow"
          />
        </NuxtLink>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
defineProps<{
  itemCount: number
  total: number
  to: string
  tableNumber?: number
}>()
</script>

<style scoped>
.floating-cart-bar {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  width: calc(100% - 2rem);
  max-width: 640px;
  pointer-events: none;
}

.cart-bar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1.25rem;
  background: linear-gradient(135deg, #1c1c1c 0%, #262626 50%, #171717 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  pointer-events: all;
}

.cart-bar-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.cart-icon-wrapper {
  position: relative;
  flex-shrink: 0;
}

.cart-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: #fbbf24;
}

.cart-badge {
  position: absolute;
  top: -0.375rem;
  right: -0.375rem;
  min-width: 1.125rem;
  height: 1.125rem;
  padding: 0 0.25rem;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #1c1c1c;
  font-size: 0.6rem;
  font-weight: 700;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #171717;
  line-height: 1;
}

.cart-bar-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.cart-bar-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
}

.cart-bar-table {
  font-size: 0.7rem;
  color: #fbbf24;
  font-weight: 600;
}

.cart-bar-total {
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  text-align: center;
}

.cart-bar-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #1c1c1c;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: 0.625rem;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.35);
}

.cart-bar-btn:hover {
  background: linear-gradient(135deg, #d97706, #b45309);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.5);
  transform: translateY(-1px);
}

.btn-arrow {
  width: 0.875rem;
  height: 0.875rem;
}

/* Transición de entrada/salida */
.cart-bar-enter-active,
.cart-bar-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.cart-bar-enter-from,
.cart-bar-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(100px) scale(0.9);
}
</style>
