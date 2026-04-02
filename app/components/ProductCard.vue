<template>
  <div>
    <UCard :ui="{ body: 'p-4 sm:p-4', footer: 'p-4 sm:p-4' }">
      <template #header>
        <div class="flex justify-center overflow-hidden h-40 -m-4 sm:-m-6 mb-0 sm:mb-0">
          <img
            :src="imageUrl"
            :alt="name"
            class="w-full h-full object-cover"
          >
        </div>
      </template>

      <div class="flex flex-col gap-2">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
          {{ name }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 h-10">
          {{ description }}
        </p>
        <span class="text-xl font-bold text-primary mt-1">S/ {{ price.toFixed(2) }}</span>
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
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  id: string | number
  imageUrl: string
  name: string
  description: string
  price: number
  quantity?: number
}>(), {
  quantity: 0
})

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
