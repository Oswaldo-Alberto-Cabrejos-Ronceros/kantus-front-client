<template>
  <div>
    <UCard :ui="{ body: 'p-4 sm:p-4', footer: 'p-4 sm:p-4' }">
      <template #header>
        <div
          class="relative flex justify-center overflow-hidden h-40 -m-4 sm:-m-6 mb-0 sm:mb-0 cursor-pointer"
          @click="isDetailOpen = true"
        >
          <img
            :src="imageUrl"
            :alt="name"
            class="w-full h-full object-cover"
          >
          <span
            v-if="hasOffer"
            class="absolute top-3 left-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg"
          >
            {{ promotion!.tipo === 'porcentaje' ? `-${promotion!.valor}%` : `S/ ${promotion!.valor} OFF` }}
          </span>
        </div>
      </template>

      <div class="flex flex-col gap-2 cursor-pointer" @click="isDetailOpen = true">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
          {{ name }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 h-10">
          {{ description }}
        </p>
        <div class="mt-1 flex items-baseline gap-2">
          <span class="text-xl font-bold text-primary">S/ {{ effectivePrice.toFixed(2) }}</span>
          <span v-if="hasOffer" class="text-sm text-gray-400 line-through">S/ {{ price.toFixed(2) }}</span>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-center min-h-[36px]">
          <UButton
            v-if="quantity === 0"
            icon="i-lucide-shopping-cart"
            label="Agregar"
            color="primary"
            variant="solid"
            class="w-full justify-center"
            @click="updateQuantity(1)"
          />
          <UInputNumber
            v-else
            v-model="localQuantity"
            class="w-full"
            @update:model-value="onInputChange"
          />
        </div>
      </template>
    </UCard>

    <!-- Detalle del producto -->
    <UModal v-model:open="isDetailOpen" :title="name">
      <template #body>
        <div class="flex flex-col gap-4">
          <div class="relative overflow-hidden rounded-xl">
            <img
              :src="imageUrl"
              :alt="name"
              class="w-full h-52 object-cover"
            >
            <span
              v-if="hasOffer"
              class="absolute top-3 left-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg"
            >
              {{ promotion!.tipo === 'porcentaje' ? `-${promotion!.valor}%` : `S/ ${promotion!.valor} OFF` }}
            </span>
          </div>

          <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {{ description }}
          </p>

          <div class="flex items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-800 pt-4">
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-primary">S/ {{ effectivePrice.toFixed(2) }}</span>
              <span v-if="hasOffer" class="text-sm text-gray-400 line-through">S/ {{ price.toFixed(2) }}</span>
            </div>
            <UButton
              v-if="quantity === 0"
              icon="i-lucide-shopping-cart"
              label="Agregar"
              color="primary"
              @click="updateQuantity(1)"
            />
            <UInputNumber
              v-else
              v-model="localQuantity"
              class="w-32"
              @update:model-value="onInputChange"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import type { Promotion } from '~/utils/types'
import { getEffectivePrice, hasActivePromotion } from '~/utils/pricing'

const props = withDefaults(defineProps<{
  id: string | number
  imageUrl: string
  name: string
  description: string
  price: number
  promotion?: Promotion
  quantity?: number
}>(), {
  quantity: 0
})

const effectivePrice = computed(() => getEffectivePrice(props.price, props.promotion))
const hasOffer = computed(() => hasActivePromotion(props.promotion))

const isDetailOpen = ref(false)

const emit = defineEmits<{
  (e: 'update:quantity', value: number): void
}>()

const localQuantity = ref(props.quantity)

// Sincroniza la cantidad local en caso de que cambie desde el componente padre
watch(() => props.quantity, (newVal) => {
  localQuantity.value = newVal
})

const updateQuantity = (newQuantity: number) => {
  const validQuantity = Math.max(0, newQuantity)
  localQuantity.value = validQuantity
  emit('update:quantity', validQuantity)
}

const onInputChange = () => {
  updateQuantity(localQuantity.value || 0)
}
</script>
