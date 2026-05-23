<template>
  <Transition name="banner-slide">
    <div v-if="store.lastOrder && visible" class="active-order-banner">
      <div class="banner-content">
        <div class="banner-left">
          <div class="banner-pulse" />
          <div class="banner-text">
            <span class="banner-label">Pedido activo</span>
            <span class="banner-code">{{ store.lastOrder.code ?? store.lastOrder.id }}</span>
          </div>
        </div>
        <div class="banner-actions">
          <a
            v-if="store.lastOrder.code"
            :href="`${apiBaseUrl}/api/comprobantes/by-order/${store.lastOrder.code}/view`"
            target="_blank"
            class="banner-btn banner-btn-boleta"
          >
            <UIcon name="i-lucide-receipt" class="w-3.5 h-3.5" />
            Ver boleta
          </a>
          <button class="banner-btn banner-btn-close" type="button" @click="dismiss">
            <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const store = useMyOrderStore()
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl as string

const visible = ref(true)

function dismiss() {
  visible.value = false
}
</script>

<style scoped>
.active-order-banner {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  width: calc(100% - 2rem);
  max-width: 480px;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  background: #1c1c1c;
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 0.75rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.banner-left {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-width: 0;
}

.banner-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f59e0b;
  flex-shrink: 0;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.85); }
}

.banner-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.banner-label {
  font-size: 0.65rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.banner-code {
  font-size: 0.8rem;
  font-weight: 700;
  color: #f59e0b;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.05em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.banner-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.banner-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.625rem;
  border-radius: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  text-decoration: none;
  transition: all 0.15s ease;
}

.banner-btn-boleta {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.25);
}

.banner-btn-boleta:hover {
  background: rgba(245, 158, 11, 0.25);
}

.banner-btn-close {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.4);
}

.banner-btn-close:hover {
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.7);
}

/* Transition */
.banner-slide-enter-active,
.banner-slide-leave-active {
  transition: all 0.3s ease;
}
.banner-slide-enter-from,
.banner-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}
</style>
