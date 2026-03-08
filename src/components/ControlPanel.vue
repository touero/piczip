<script setup>
const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
  disabled: Boolean,
  isProcessing: Boolean,
  progress: {
    type: Number,
    default: 0,
  },
  queueCount: {
    type: Number,
    default: 0,
  },
})

  const emit = defineEmits(['update:options', 'start'])

  const onChange = (key, value) => {
    emit('update:options', { ...props.options, [key]: value })
  }
</script>

<template>
  <div class="glass-card rounded-2xl p-6 md:p-7 flex flex-col gap-6 text-brand-50">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="section-title">Compression profile</p>
        <p class="text-sm text-brand-200">Tune output quality, dimensions, and format.</p>
      </div>
      <div class="px-3 py-1 rounded-full bg-surface-600 text-brand-50 text-sm font-semibold">
        {{ queueCount }} in queue
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="space-y-2">
        <div class="flex items-center justify-between text-sm text-brand-200">
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
          @input="(e) => onChange('quality', Number(e.target.value))"
        />
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between text-sm text-brand-200">
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
          @input="(e) => onChange('maxDimension', Number(e.target.value))"
        />
      </div>

      <div class="space-y-1">
        <label class="text-sm text-brand-200">Format</label>
        <select
          :value="options.format"
          class="w-full rounded-xl border border-surface-600 px-3 py-2 bg-surface-700 text-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
          @change="(e) => onChange('format', e.target.value)"
        >
          <option class="bg-surface-700" value="auto">Keep original</option>
          <option class="bg-surface-700" value="image/webp">WebP</option>
          <option class="bg-surface-700" value="image/jpeg">JPEG</option>
          <option class="bg-surface-700" value="image/png">PNG</option>
        </select>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <button
        type="button"
        class="w-full md:w-auto px-5 py-3 rounded-xl bg-brand-500 text-surface-900 font-semibold shadow-card disabled:opacity-60 disabled:cursor-not-allowed hover:bg-brand-600 transition"
        :disabled="disabled || isProcessing"
        @click="emit('start')"
      >
        <span v-if="!isProcessing">Compress {{ queueCount ? `${queueCount} image${queueCount > 1 ? 's' : ''}` : '' }}</span>
        <span v-else>Processing… {{ progress }}%</span>
      </button>
      <div v-if="isProcessing" class="w-full h-2 bg-surface-700 rounded-full overflow-hidden">
        <div class="h-full bg-brand-500 transition-all" :style="{ width: `${progress}%` }"></div>
      </div>
      <p class="text-xs text-brand-200">We compress in-browser. Your images never leave the device.</p>
    </div>
  </div>
</template>
