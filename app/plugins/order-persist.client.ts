/**
 * Plugin cliente: hidrata el último pedido desde localStorage al iniciar la app.
 * El sufijo `.client.ts` garantiza que Nuxt solo ejecute esto en el navegador.
 */
export default defineNuxtPlugin(() => {
  const store = useMyOrderStore()
  store.hydrateFromStorage()
})
