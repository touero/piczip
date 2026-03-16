<script setup lang="ts">
import type { CompressionOptions, OutputFormat } from '../utils/compress'

interface Props {
  options: CompressionOptions
  disabled?: boolean
  isProcessing?: boolean
  progress?: number
  queueCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  isProcessing: false,
  progress: 0,
  queueCount: 0,
})

const emit = defineEmits<{
  'update:options': [value: CompressionOptions]
  start: []
}>()

const onChange = <K extends keyof CompressionOptions>(key: K, value: CompressionOptions[K]) => {
  emit('update:options', { ...props.options, [key]: value })
}

const onQualityInput = (event: Event) => {
  onChange('quality', Number((event.target as HTMLInputElement).value))
}

const onMaxDimensionInput = (event: Event) => {
  onChange('maxDimension', Number((event.target as HTMLInputElement).value))
}

const onFormatChange = (event: Event) => {
  onChange('format', (event.target as HTMLSelectElement).value as OutputFormat)
}
</script>

<template>
  <div class="glass-card rounded-2xl p-4 md:p-5 flex flex-col gap-4 text-brand-50">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="section-title">Compression profile</p>
        <p class="text-[11px] text-brand-200">Quality, size, format</p>
      </div>
      <div class="px-2.5 py-1 rounded-full bg-surface-600 text-brand-50 text-[11px] font-semibold">
        {{ queueCount }} files
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-xs text-brand-200">
          <span>Quality</span>
          <span class="font-semibold text-brand-50">{{ options.quality }}%</span>
        </div>
        <input
          type="range"
          min="40"
          max="95"
          step="1"
          class="w-full accent-brand-500"
          :value="options.quality"
          @input="onQualityInput"
        />
      </div>

      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-xs text-brand-200">
          <span>Max dimension</span>
          <span class="font-semibold text-brand-50">{{ options.maxDimension }} px</span>
        </div>
        <input
          type="range"
          min="16"
          max="4096"
          step="16"
          class="w-full accent-brand-500"
          :value="options.maxDimension"
          @input="onMaxDimensionInput"
        />
      </div>

      <div class="space-y-1">
        <label class="text-xs text-brand-200">Format</label>
        <select
          :value="options.format"
          class="w-full rounded-lg border border-surface-600 px-3 py-1.5 bg-surface-700 text-sm text-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
          @change="onFormatChange"
        >
          <option class="bg-surface-700" value="auto">Keep original</option>
          <option class="bg-surface-700" value="image/webp">WebP</option>
          <option class="bg-surface-700" value="image/jpeg">JPEG</option>
          <option class="bg-surface-700" value="image/png">PNG</option>
        </select>
      </div>
    </div>

    <div class="flex flex-col gap-2.5">
      <button
        type="button"
        class="w-full md:w-auto px-4 py-2 rounded-lg bg-brand-500 text-surface-900 text-sm font-semibold shadow-card disabled:opacity-60 disabled:cursor-not-allowed hover:bg-brand-600 transition"
        :disabled="disabled || isProcessing"
        @click="emit('start')"
      >
        <span v-if="!isProcessing">Compress{{ queueCount ? ` ${queueCount}` : '' }}</span>
        <span v-else>Processing… {{ progress }}%</span>
      </button>
      <div v-if="isProcessing" class="w-full h-1.5 bg-surface-700 rounded-full overflow-hidden">
        <div class="h-full bg-brand-500 transition-all" :style="{ width: `${progress}%` }"></div>
      </div>
      <p class="text-[11px] text-brand-200">Local only</p>
    </div>
  </div>
</template>
