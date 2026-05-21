import { z } from 'zod'

// Schema de pago (tarjeta)
export const cardSchema = z.object({
  fullName: z.string().min(3, 'El nombre es obligatorio'),
  cardNumber: z
    .string()
    .min(16, 'El número de tarjeta debe tener 16 dígitos')
    .max(16, 'El número de tarjeta debe tener 16 dígitos')
    .regex(/^\d+$/, 'Solo números'),
  cvv: z.string().min(3, 'CVV inválido').max(4, 'CVV inválido').regex(/^\d+$/, 'Solo números'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Formato MM/AA')
})

// Schema de datos de delivery
export const deliveryDataSchema = z.object({
  customerName: z.string('El nombre es obligatorio').min(3, 'El nombre es obligatorio'),
  address: z.string('La dirección es obligatoria').min(5, 'La dirección es obligatoria'),
  phone: z
    .string('El teléfono es obligatorio')
    .min(9, 'El teléfono debe tener al menos 9 dígitos')
    .regex(/^\d+$/, 'Solo números')
})

// Schema de pago para salón (método)
export const paymentMethodSchema = z.object({
  paymentMethod: z.enum(['cash', 'card'], { message: 'Selecciona un método de pago' })
})

// Schema completo de checkout delivery
export const deliveryCheckoutSchema = deliveryDataSchema.merge(
  z.object({
    paymentMethod: z.enum(['cash', 'card'])
  })
)

// Schema completo de checkout sala (solo método de pago)
export const roomCheckoutSchema = z.object({
  paymentMethod: z.enum(['cash', 'card'], { message: 'Selecciona un método de pago' })
})

// Legacy - mantener compatibilidad
export const payerSchema = cardSchema

export type CardRequest = z.infer<typeof cardSchema>
export type PayerRequest = CardRequest
export type DeliveryDataRequest = z.infer<typeof deliveryDataSchema>
export type DeliveryCheckoutRequest = z.infer<typeof deliveryCheckoutSchema>
export type RoomCheckoutRequest = z.infer<typeof roomCheckoutSchema>
