<template>
  <div>
    <div class="text-lg font-bold text-primary mb-4">
      Monto a Pagar: S/ {{ total.toFixed(2) }}
    </div>
    <UForm
      :schema="payerSchema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField
        label="Nombre y apellidos"
        name="fullName"
      >
        <UInput
          v-model="state.fullName"
          placeholder="John Doe"
        />
      </UFormField>

      <UFormField
        label="Nro de Tarjeta"
        name="cardNumber"
      >
        <UInput
          v-model="state.cardNumber"
          placeholder="**** **** **** ****"
        />
      </UFormField>

      <div class="grid grid-cols-2 gap-4">
        <UFormField
          label="Fecha vencimiento"
          name="expiryDate"
        >
          <UInput
            v-model="state.expiryDate"
            placeholder="MM/AA"
          />
        </UFormField>

        <UFormField
          label="CVV"
          name="cvv"
        >
          <UInput
            v-model="state.cvv"
            placeholder="123"
          />
        </UFormField>
      </div>

      <UButton
        type="submit"
        size="lg"
        block
        label="Pagar"
        color="primary"
        :loading="loading"
      />
    </UForm>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import { payerSchema, type PayerRequest } from '~/utils/validations'

defineProps<{
  total: number
}>()

const loading = ref(false)

const state = reactive<Partial<PayerRequest>>({
  fullName: undefined,
  cardNumber: undefined,
  cvv: undefined,
  expiryDate: undefined
})

async function onSubmit(event: FormSubmitEvent<PayerRequest>) {
  loading.value = true
  console.log('Datos de pago:', event.data)
  // Simula un proceso de pago
  await new Promise(resolve => setTimeout(resolve, 2000))
  loading.value = false
  // Aquí normalmente emitirías un evento o llamarías a una acción de la store
}
</script>
