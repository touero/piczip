<script setup>
const emit = defineEmits(['files-selected'])

const onSelect = (event) => {
  const files = event.target.files
  if (files?.length) emit('files-selected', files)
  event.target.value = ''
}

const onDrop = (event) => {
  event.preventDefault()
  const { files } = event.dataTransfer || {}
  if (files?.length) emit('files-selected', files)
}

const onDragOver = (event) => {
  event.preventDefault()
}
</script>

<template>
  <div
    class="glass-card rounded-2xl p-6 md:p-8 border-dashed border-2 border-brand-400/60"
    @drop="onDrop"
    @dragover="onDragOver"
  >
    <div class="flex flex-col gap-4 items-center text-center text-brand-50">
      <div class="w-14 h-14 rounded-full bg-brand-700 flex items-center justify-center text-surface-900 font-semibold">
        UP
      </div>
      <div class="space-y-1">
        <p class="text-lg font-semibold text-brand-50">Drop your images</p>
        <p class="text-sm text-brand-200">JPEG, PNG, WebP, or AVIF — we keep the quality high while shrinking size.</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 items-center">
        <label
          class="px-4 py-2 rounded-xl bg-brand-500 text-surface-900 font-semibold shadow-card cursor-pointer hover:bg-brand-600 transition"
        >
          Browse files
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            class="hidden"
            @change="onSelect"
          />
        </label>
        <p class="text-xs text-brand-200">or drag & drop up to 20 images</p>
      </div>
    </div>
  </div>
</template>
