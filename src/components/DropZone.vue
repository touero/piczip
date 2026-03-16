<script setup lang="ts">
const emit = defineEmits<{
  'files-selected': [files: FileList]
}>()

const onSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const { files } = target
  if (files?.length) {
    emit('files-selected', files)
  }
  target.value = ''
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  const { files } = event.dataTransfer || {}
  if (files?.length) emit('files-selected', files)
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
}
</script>

<template>
  <div
    class="glass-card rounded-2xl p-4 md:p-5 border-dashed border-2 border-brand-400/80 bg-[linear-gradient(135deg,rgba(215,153,33,0.18),rgba(40,40,40,0.95)_42%)]"
    @drop="onDrop"
    @dragover="onDragOver"
  >
    <div class="flex flex-col gap-4 items-start text-brand-50">
      <div class="space-y-1.5">
        <p class="section-title">Input</p>
        <p class="text-lg md:text-2xl font-semibold leading-tight text-brand-50">Select images to compress</p>
        <p class="text-sm text-brand-200">Drag files here or use the primary button below.</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <label
          class="inline-flex items-center justify-center min-w-[12rem] px-5 py-3 rounded-xl bg-brand-500 text-surface-900 text-base font-semibold cursor-pointer shadow-card hover:bg-brand-600 transition"
        >
          Select files
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            class="hidden"
            @change="onSelect"
          />
        </label>
        <p class="text-xs text-brand-200">JPEG, PNG, WebP, AVIF. Drag and drop supported.</p>
      </div>
    </div>
  </div>
</template>
