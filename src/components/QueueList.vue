<script setup lang="ts">
import { formatBytes } from '../utils/format'
import type { QueueItem } from '../composables/useImageCompressor'

withDefaults(
  defineProps<{
    items?: QueueItem[]
  }>(),
  {
    items: () => [],
  }
)

const emit = defineEmits<{
  remove: [id: string]
}>()
</script>

<template>
  <div class="glass-card rounded-xl p-3.5 text-brand-50">
    <div class="flex items-center justify-between mb-2.5">
      <p class="section-title">Queue</p>
      <p class="text-[11px] text-brand-200">{{ items.length }} files</p>
    </div>
    <div v-if="items.length" class="space-y-2">
      <div
        v-for="item in items"
        :key="item.id"
        class="flex items-center justify-between gap-2.5 rounded-lg border border-surface-600 px-2.5 py-2 bg-surface-700"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-8 h-8 rounded-lg bg-surface-600 text-brand-50 flex items-center justify-center text-[11px] font-semibold shrink-0">
            {{ item.file.type.split('/')[1]?.toUpperCase() || 'IMG' }}
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-brand-50 leading-tight truncate">{{ item.file.name }}</p>
            <p class="text-[11px] text-brand-200">{{ formatBytes(item.file.size) }}</p>
          </div>
        </div>
        <button
          type="button"
          class="text-[11px] text-brand-200 hover:text-brand-50 font-semibold shrink-0"
          @click="emit('remove', item.id)"
        >
          Remove
        </button>
      </div>
    </div>
    <div v-else class="text-xs text-brand-200">Empty</div>
  </div>
</template>
