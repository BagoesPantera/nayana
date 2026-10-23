<script setup lang="ts">
const { data: markers } = await useFetch('/api/markers')
</script>

<template>
  <div class="p-4">
    <p class="text-lg font-semibold">{{ markers?.length ?? 0 }} CCTV markers loaded</p>
  </div>
</template>
