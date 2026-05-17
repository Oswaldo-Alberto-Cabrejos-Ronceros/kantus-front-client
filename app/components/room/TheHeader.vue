<script setup lang="ts">
import { useMyOrderStore } from '~/stores/order'

const orderStore = useMyOrderStore()

// La ruta del carrito depende de si estamos en una mesa o salón
const cartRoute = computed(() =>
  orderStore.activeTable ? `/mesa/${orderStore.activeTable.id}/pedido` : '/salon/pedido'
)

const backRoute = computed(() =>
  orderStore.activeTable ? `/mesa/${orderStore.activeTable.id}` : '/salon'
)
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink :to="backRoute">
        <div class="flex gap-3 items-center">
          <img
            src="/image/logo.jpg"
            alt="Logo"
            width="40"
            class="rounded-lg"
          >
          <div class="flex flex-col leading-tight">
            <span class="text-primary font-bold text-lg leading-none">Kantus</span>
            <span class="text-xs text-gray-500 dark:text-gray-400 leading-none">
              {{ orderStore.activeTable ? `Mesa #${orderStore.activeTable.number}` : 'Salón' }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </template>

    <template #right>
      <!-- Badge de mesa activa -->
      <div
        v-if="orderStore.activeTable"
        class="table-chip"
      >
        <UIcon
          name="i-lucide-utensils"
          class="table-chip-icon"
        />
        <span>Mesa {{ orderStore.activeTable.number }}</span>
      </div>

      <UColorModeButton />

      <NuxtLink
        :to="cartRoute"
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
            v-if="orderStore.roomItemCount > 0"
            class="cart-badge"
          >
            {{ orderStore.roomItemCount > 99 ? '99+' : orderStore.roomItemCount }}
          </span>
        </Transition>
      </NuxtLink>
    </template>
  </UHeader>
</template>

<style scoped>
.table-chip {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3rem 0.75rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.15));
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #059669;
  white-space: nowrap;
}

:root.dark .table-chip {
  color: #34d399;
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.25);
}

.table-chip-icon {
  width: 0.875rem;
  height: 0.875rem;
}

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
