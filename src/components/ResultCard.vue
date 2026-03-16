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
  <div class="px-4 py-3 text-brand-50">
    <div class="grid grid-cols-1 md:grid-cols-[4rem_minmax(0,1.2fr)_repeat(3,minmax(0,7rem))_auto] gap-3 items-center">
      <a
        class="block w-16 h-16 rounded-lg overflow-hidden bg-surface-700 border border-surface-600"
        :href="item.url"
        target="_blank"
        rel="noopener"
      >
        <img :src="item.url" :alt="item.name" class="w-full h-full object-cover" />
      </a>

      <div class="min-w-0">
        <p class="text-sm font-semibold text-brand-50 truncate">{{ item.name }}</p>
        <p class="text-[11px] text-brand-200 mt-1">
          {{ item.width }}×{{ item.height }} · {{ item.format.replace('image/', '').toUpperCase() }}
        </p>
        <p class="text-[11px] text-brand-200 truncate">{{ item.originalName }}</p>
      </div>

      <div class="rounded-lg bg-surface-700 px-2.5 py-2 text-[11px] text-brand-200">
        <p class="font-semibold text-brand-50">{{ formatBytes(item.originalSize) }}</p>
        <p>Input</p>
      </div>

      <div class="rounded-lg bg-surface-700 px-2.5 py-2 text-[11px] text-brand-200">
        <p class="font-semibold text-brand-50">{{ formatBytes(item.compressedSize) }}</p>
        <p>Output</p>
      </div>

      <div class="rounded-lg bg-[#3c3836] px-2.5 py-2 text-[11px] text-brand-50">
        <p class="font-semibold">{{ formatPercent(item.ratio) }}</p>
        <p>Saved</p>
      </div>

      <div class="flex flex-wrap md:justify-end gap-2">
        <a
          class="px-3 py-1.5 rounded-lg bg-brand-500 text-surface-900 text-xs font-semibold shadow-card hover:bg-brand-600 transition"
          :href="item.url"
          :download="item.name"
        >
          Download
        </a>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg border border-surface-600 text-xs font-semibold text-brand-50 hover:border-brand-400"
          @click="emit('remove', item.id)"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>
