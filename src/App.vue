<script setup lang="ts">
import HomePage from './pages/HomePage.vue'
</script>

<template>
  <div class="min-h-screen">
    <header class="max-w-6xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between border-b border-surface-700/80">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-brand-600 text-surface-900 text-xs font-bold grid place-items-center">PZ</div>
        <div>
          <p class="text-sm font-semibold text-brand-50">PicZip</p>
          <p class="text-[11px] text-brand-200">Local image compression</p>
        </div>
      </div>
    </header>
    <HomePage />
    <footer class="max-w-6xl mx-auto px-4 py-4 text-[11px] text-brand-200">© 2026 weiensong</footer>
  </div>
</template>
