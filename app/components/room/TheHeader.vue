<script setup lang="ts">
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/salon">
        <div class="flex gap-4 items-center justify-center">
          <img
            src="/image/logo.jpg"
            alt="Logo"
            width="48"
          >
          <h2 class="text-primary text-2xl ">Delivery</h2>
        </div>

      </NuxtLink>
    </template>

    <template #right>
      <UColorModeButton />
      <UButton
        icon="i-lucide-shopping-basket"
        size="md"
        color="primary"
        variant="ghost"
        to="/salon/pedido"
      />
    </template>
  </UHeader>
</template>
