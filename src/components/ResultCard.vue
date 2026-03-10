<script setup lang="ts">
import { formatBytes, formatPercent } from '../utils/format'
import type { ResultItem } from '../composables/useImageCompressor'

defineProps<{
  item: ResultItem
}>()

const emit = defineEmits<{
  remove: [id: string]
}>()
</script>

<template>
  <div class="glass-card rounded-2xl p-4 md:p-5 flex flex-col gap-3 text-brand-50">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-sm font-semibold text-brand-50">{{ item.name }}</p>
        <p class="text-xs text-brand-200">{{ item.width }}×{{ item.height }} · {{ item.format.replace('image/', '').toUpperCase() }}</p>
      </div>
      <button
        type="button"
        class="text-xs text-brand-200 hover:text-brand-50 font-semibold"
        @click="emit('remove', item.id)"
      >
        Remove
      </button>
    </div>

    <div class="grid grid-cols-3 gap-3 text-xs text-brand-200">
      <div class="rounded-lg bg-surface-700 px-3 py-2">
        <p class="font-semibold text-brand-50">{{ formatBytes(item.originalSize) }}</p>
        <p>Original</p>
      </div>
      <div class="rounded-lg bg-surface-700 px-3 py-2">
        <p class="font-semibold text-brand-50">{{ formatBytes(item.compressedSize) }}</p>
        <p>Compressed</p>
      </div>
      <div class="rounded-lg bg-[#3c3836] px-3 py-2 text-brand-50">
        <p class="font-semibold">{{ formatPercent(item.ratio) }} saved</p>
        <p>Efficiency</p>
      </div>
    </div>

    <div class="flex flex-wrap gap-2">
      <a
        class="px-4 py-2 rounded-xl bg-brand-500 text-surface-900 text-sm font-semibold shadow-card hover:bg-brand-600 transition"
        :href="item.url"
        :download="item.name"
      >
        Download
      </a>
      <a
        class="px-4 py-2 rounded-xl border border-surface-600 text-sm font-semibold text-brand-50 hover:border-brand-400"
        :href="item.url"
        target="_blank"
        rel="noopener"
      >
        Preview
      </a>
    </div>
  </div>
</template>
