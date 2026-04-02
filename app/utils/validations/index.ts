import { z } from 'zod'

export const payerSchema = z.object({
  fullName: z.string().min(3, 'El nombre es obligatorio'),
  cardNumber: z.string().length(16, 'El número de tarjeta debe tener 16 dígitos'),
  cvv: z.string().min(3, 'El CVV debe tener al menos 3 dígitos').max(4, 'El CVV no puede tener más de 4 dígitos'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'La fecha debe tener el formato MM/AA')
})

export type PayerRequest = z.infer<typeof payerSchema>
