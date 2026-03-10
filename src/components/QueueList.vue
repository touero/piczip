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
  <div class="glass-card rounded-2xl p-5 text-brand-50">
    <div class="flex items-center justify-between mb-4">
      <p class="section-title">Queue</p>
      <p class="text-xs text-brand-200">Ready for compression</p>
    </div>
    <div v-if="items.length" class="space-y-3">
      <div
        v-for="item in items"
        :key="item.id"
        class="flex items-center justify-between gap-3 rounded-xl border border-surface-600 px-4 py-3 bg-surface-700"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-surface-600 text-brand-50 flex items-center justify-center text-sm font-semibold">
            {{ item.file.type.split('/')[1]?.toUpperCase() || 'IMG' }}
          </div>
          <div>
            <p class="text-sm font-semibold text-brand-50">{{ item.file.name }}</p>
            <p class="text-xs text-brand-200">{{ formatBytes(item.file.size) }}</p>
          </div>
        </div>
        <button
          type="button"
          class="text-xs text-brand-200 hover:text-brand-50 font-semibold"
          @click="emit('remove', item.id)"
        >
          Remove
        </button>
      </div>
    </div>
    <div v-else class="text-sm text-brand-200">No images queued yet.</div>
  </div>
</template>
