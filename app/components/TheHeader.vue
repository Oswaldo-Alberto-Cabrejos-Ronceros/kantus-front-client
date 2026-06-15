<script setup lang="ts">
import { useMyOrderStore } from '~/stores/order'

const orderStore = useMyOrderStore()
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <div class="flex gap-3 items-center">
          <img
            src="/image/logo.jpg"
            alt="Logo"
            width="40"
            class="rounded-lg"
          >
          <div class="flex flex-col leading-tight">
            <span class="text-primary font-bold text-lg leading-none">Kantus</span>
            <span class="text-xs text-gray-500 dark:text-gray-400 leading-none">Delivery</span>
          </div>
        </div>
      </NuxtLink>
    </template>

    <template #right>
      <UColorModeButton />
      <UButton
        to="/mis-pedidos"
        icon="i-lucide-receipt-text"
        size="md"
        color="neutral"
        variant="ghost"
        aria-label="Mis pedidos"
      />
      <NuxtLink
        to="/pedido"
        class="relative"
      >
        <UButton
          icon="i-lucide-shopping-basket"
          size="md"
          color="primary"
          variant="ghost"
        />
        <Transition name="badge-pop">
          <span
            v-if="orderStore.deliveryItemCount > 0"
            class="cart-badge"
          >
            {{ orderStore.deliveryItemCount > 99 ? '99+' : orderStore.deliveryItemCount }}
          </span>
        </Transition>
      </NuxtLink>
    </template>
  </UHeader>
</template>

<style scoped>
.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 1.1rem;
  height: 1.1rem;
  padding: 0 3px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid white;
  line-height: 1;
  pointer-events: none;
}

:root.dark .cart-badge {
  border-color: #111827;
}

.badge-pop-enter-active {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.badge-pop-leave-active {
  transition: all 0.15s ease;
}

.badge-pop-enter-from,
.badge-pop-leave-to {
  transform: scale(0);
  opacity: 0;
}
</style>
