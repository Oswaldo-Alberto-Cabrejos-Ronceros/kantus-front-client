<template>
  <div class="delivery-form">
    <div class="form-header">
      <div class="form-icon">
        <UIcon name="i-lucide-map-pin" />
      </div>
      <div>
        <h3 class="form-title">
          Datos de entrega
        </h3>
        <p class="form-subtitle">
          ¿A dónde enviamos tu pedido?
        </p>
      </div>
    </div>

    <UForm
      :schema="deliveryDataSchema"
      :state="state"
      class="form-fields"
      @submit="onSubmit"
    >
      <UFormField
        label="Nombre completo"
        name="customerName"
      >
        <UInput
          v-model="state.customerName"
          placeholder="Juan García"
          icon="i-lucide-user"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Dirección de entrega"
        name="address"
      >
        <UTextarea
          v-model="state.address"
          placeholder="Av. Principal 123, Urb. Los Pinos, Miraflores"
          :rows="2"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Teléfono de contacto"
        name="phone"
      >
        <UInput
          v-model="state.phone"
          placeholder="987 654 321"
          icon="i-lucide-phone"
          class="w-full"
          type="tel"
        />
      </UFormField>

      <div class="form-actions">
        <UButton
          type="submit"
          size="lg"
          block
          color="primary"
          label="Continuar al pago"
          trailing-icon="i-lucide-arrow-right"
        />
      </div>
    </UForm>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import { deliveryDataSchema, type DeliveryDataRequest } from '~/utils/validations'

const emit = defineEmits<{
  (e: 'submit', data: DeliveryDataRequest): void
}>()

const state = reactive<Partial<DeliveryDataRequest>>({
  customerName: undefined,
  address: undefined,
  phone: undefined
})

function onSubmit(event: FormSubmitEvent<DeliveryDataRequest>) {
  emit('submit', event.data)
}
</script>

<style scoped>
.delivery-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 1.25rem;
  background: rgba(245, 158, 11, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.15);
  border-radius: 0.75rem;
}

.form-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 0.625rem;
  color: #1c1c1c;
  flex-shrink: 0;
}

.form-title {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
}

:root.dark .form-title {
  color: #f9fafb;
}

.form-subtitle {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.125rem;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-actions {
  margin-top: 0.5rem;
}
</style>
