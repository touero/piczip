<script setup>
import HomePage from './pages/HomePage.vue'
</script>

<template>
  <div class="min-h-screen">
    <header class="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-brand-600 text-surface-900 font-bold grid place-items-center shadow-card">PZ</div>
        <div>
          <p class="text-base font-semibold text-brand-50">PicZip</p>
          <p class="text-xs text-brand-200">Edge-ready image compression</p>
        </div>
      </div>
    </header>
    <HomePage />
    <footer class="max-w-6xl mx-auto px-4 py-8 text-xs text-brand-200">Copyright © 2026 weiensong.</footer>
  </div>
</template>
