<script setup>
import { computed } from 'vue'
import ControlPanel from '../components/ControlPanel.vue'
import DropZone from '../components/DropZone.vue'
import QueueList from '../components/QueueList.vue'
import ResultCard from '../components/ResultCard.vue'
import { useImageCompressor } from '../composables/useImageCompressor.js'
import { formatBytes, formatPercent } from '../utils/format.js'

const compressor = useImageCompressor()

const formatLabel = computed(() =>
  compressor.options.value.format === 'auto'
    ? 'AUTO'
    : compressor.options.value.format.replace('image/', '').toUpperCase()
)

const onOptionsChange = (payload) => {
  compressor.options.value = payload
}
</script>

<template>
  <section class="max-w-6xl mx-auto px-4 py-10 md:py-14 space-y-8">
    <div class="glass-card rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-6 md:gap-10 items-center">
      <div class="flex-1 space-y-3">
        <p class="section-title">PicZip · Cloudflare ready</p>
        <h1 class="text-3xl md:text-4xl font-semibold leading-tight text-brand-50">
          Compress images locally with <span class="gradient-text">studio-grade</span> quality.
        </h1>
        <p class="text-base text-brand-200">
          Drag, drop, and ship optimized assets in seconds. Runs fully in the browser—no uploads, no waiting.
        </p>
        <div class="flex flex-wrap gap-2 text-xs text-brand-200">
          <span class="px-3 py-1 rounded-full bg-surface-600 text-brand-50 font-semibold">Keeps original format</span>
          <span class="px-3 py-1 rounded-full bg-surface-600 text-brand-50 font-semibold">Client-side only</span>
          <span class="px-3 py-1 rounded-full bg-surface-600 text-brand-50 font-semibold">Cloudflare Pages ready</span>
        </div>
      </div>
      <div class="w-full md:w-80">
        <div class="rounded-2xl bg-gradient-to-br from-surface-600 via-surface-500 to-surface-700 text-brand-50 p-6 shadow-card space-y-3">
          <p class="text-sm text-brand-200">Compression profile</p>
          <p class="text-xl font-semibold">{{ formatLabel }}</p>
          <div class="flex items-center justify-between text-sm text-brand-200">
            <span>Quality</span>
            <span class="font-semibold text-brand-50">{{ compressor.options.value.quality }}%</span>
          </div>
          <div class="flex items-center justify-between text-sm text-brand-200">
            <span>Max dimension</span>
            <span class="font-semibold text-brand-50">{{ compressor.options.value.maxDimension }}px</span>
          </div>
          <div class="h-2 rounded-full bg-surface-700 overflow-hidden">
            <div class="h-full bg-brand-500" :style="{ width: `${compressor.progress.value}%` }"></div>
          </div>
          <p class="text-xs text-brand-200">{{ compressor.progress.value }}% ready</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DropZone @files-selected="compressor.addFiles" />
      <ControlPanel
        :options="compressor.options.value"
        :disabled="!compressor.hasQueue.value"
        :is-processing="compressor.isProcessing.value"
        :progress="compressor.progress.value"
        :queue-count="compressor.queue.value.length"
        @update:options="onOptionsChange"
        @start="compressor.compressAll"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="glass-card rounded-2xl p-5 text-brand-50">
        <p class="text-xs text-brand-200">Queued</p>
        <p class="text-2xl font-semibold text-brand-50">{{ compressor.queue.value.length }}</p>
        <p class="text-xs text-brand-200">Awaiting compression</p>
      </div>
      <div class="glass-card rounded-2xl p-5 text-brand-50">
        <p class="text-xs text-brand-200">Saved</p>
        <p class="text-2xl font-semibold text-brand-50">{{ formatBytes(compressor.summary.value.saved) }}</p>
        <p class="text-xs text-brand-200">{{ formatPercent(compressor.summary.value.reduction) }} average reduction</p>
      </div>
      <div class="glass-card rounded-2xl p-5 text-brand-50">
        <p class="text-xs text-brand-200">Total output</p>
        <p class="text-2xl font-semibold text-brand-50">{{ formatBytes(compressor.summary.value.compressed) }}</p>
        <p class="text-xs text-brand-200">{{ compressor.summary.value.count }} files processed</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1 space-y-4">
        <QueueList :items="compressor.queue.value" @remove="compressor.removeFromQueue" />

        <div v-if="compressor.errors.value.length" class="glass-card rounded-2xl p-5 text-sm text-[#fb4934] space-y-2">
          <p class="font-semibold">Issues</p>
          <ul class="list-disc list-inside text-[#fb4934]">
            <li v-for="issue in compressor.errors.value" :key="issue">{{ issue }}</li>
          </ul>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-4">
        <div class="flex items-center justify-between">
          <p class="section-title">Results</p>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="text-xs px-3 py-2 rounded-xl bg-surface-600 text-brand-50 font-semibold disabled:opacity-50"
              :disabled="!compressor.hasResults.value"
              @click="compressor.downloadAll"
            >
              Download all (.zip)
            </button>
            <button
              type="button"
              class="text-xs px-3 py-2 rounded-xl text-brand-200 hover:text-brand-50"
              @click="compressor.reset"
            >
              Reset
            </button>
          </div>
        </div>

        <div v-if="compressor.hasResults.value" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard
            v-for="item in compressor.results.value"
            :key="item.id"
            :item="item"
            @remove="compressor.removeResult"
          />
        </div>
        <div v-else class="glass-card rounded-2xl p-6 text-sm text-brand-200">No compressed files yet.</div>
      </div>
    </div>
  </section>
</template>
