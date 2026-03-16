<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../components/ControlPanel.vue'
import DropZone from '../components/DropZone.vue'
import QueueList from '../components/QueueList.vue'
import ResultCard from '../components/ResultCard.vue'
import { useImageCompressor } from '../composables/useImageCompressor'
import { formatBytes, formatPercent } from '../utils/format'
import type { CompressionOptions } from '../utils/compress'

const compressor = useImageCompressor()

const formatLabel = computed(() =>
  compressor.options.value.format === 'auto'
    ? 'AUTO'
    : compressor.options.value.format.replace('image/', '').toUpperCase()
)

const onOptionsChange = (payload: CompressionOptions) => {
  compressor.options.value = payload
}
</script>

<template>
  <section class="max-w-6xl mx-auto px-4 py-4 md:py-5 space-y-3 md:space-y-4">
    <div class="glass-card rounded-2xl p-4 md:p-5 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_16rem] gap-4">
      <div class="space-y-1.5">
        <p class="section-title">Image Tools</p>
        <h1 class="text-xl md:text-2xl font-semibold leading-tight text-brand-50">Compress images locally</h1>
        <div class="flex flex-wrap gap-2.5 pt-1">
          <span class="rounded-xl border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-xs font-semibold text-brand-100">No backend</span>
          <span class="rounded-xl border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-xs font-semibold text-brand-100">Batch processing</span>
          <span class="rounded-xl border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-xs font-semibold text-brand-100">Local compression</span>
          <span class="rounded-xl border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-xs font-semibold text-brand-100">Zip export</span>
          <span class="rounded-xl border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-xs font-semibold text-brand-100">Keep original format</span>
        </div>
      </div>
      <div class="w-full">
        <div class="rounded-xl border border-surface-600 bg-surface-700 text-brand-50 p-3.5 space-y-2">
          <p class="section-title">Profile</p>
          <p class="text-base font-semibold">{{ formatLabel }}</p>
          <div class="flex items-center justify-between text-xs text-brand-200">
            <span>Quality</span>
            <span class="font-semibold text-brand-50">{{ compressor.options.value.quality }}%</span>
          </div>
          <div class="flex items-center justify-between text-xs text-brand-200">
            <span>Max dimension</span>
            <span class="font-semibold text-brand-50">{{ compressor.options.value.maxDimension }}px</span>
          </div>
          <div class="h-1.5 rounded-full bg-surface-600 overflow-hidden">
            <div class="h-full bg-brand-500" :style="{ width: `${compressor.progress.value}%` }"></div>
          </div>
          <p class="text-[11px] text-brand-200">{{ compressor.progress.value }}%</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] gap-3">
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

    <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5">
      <div class="glass-card rounded-xl p-3.5 text-brand-50">
        <p class="section-title">Queue</p>
        <p class="text-lg font-semibold text-brand-50 leading-none mt-1">{{ compressor.queue.value.length }}</p>
        <p class="text-[11px] text-brand-200 mt-1">files</p>
      </div>
      <div class="glass-card rounded-xl p-3.5 text-brand-50">
        <p class="section-title">Saved</p>
        <p class="text-lg font-semibold text-brand-50 leading-none mt-1">{{ formatBytes(compressor.summary.value.saved) }}</p>
        <p class="text-[11px] text-brand-200 mt-1">{{ formatPercent(compressor.summary.value.reduction) }}</p>
      </div>
      <div class="glass-card rounded-xl p-3.5 text-brand-50">
        <p class="section-title">Output</p>
        <p class="text-lg font-semibold text-brand-50 leading-none mt-1">{{ formatBytes(compressor.summary.value.compressed) }}</p>
        <p class="text-[11px] text-brand-200 mt-1">{{ compressor.summary.value.count }} files</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[19rem_minmax(0,1fr)] gap-3">
      <div class="space-y-2.5">
        <QueueList :items="compressor.queue.value" @remove="compressor.removeFromQueue" />

        <div v-if="compressor.errors.value.length" class="glass-card rounded-xl p-3.5 text-sm text-[#fb4934] space-y-1.5">
          <p class="font-semibold">Errors</p>
          <ul class="list-disc list-inside text-[#fb4934]">
            <li v-for="issue in compressor.errors.value" :key="issue">{{ issue }}</li>
          </ul>
        </div>
      </div>

      <div class="glass-card rounded-xl overflow-hidden">
        <div class="px-4 py-3 border-b border-surface-600 flex items-center justify-between gap-3">
          <div>
            <p class="section-title">Results</p>
            <p class="text-[11px] text-brand-200 mt-1">{{ compressor.summary.value.count || 0 }} processed files</p>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="text-[11px] px-2.5 py-1.5 rounded-lg bg-surface-600 text-brand-50 font-semibold disabled:opacity-50"
              :disabled="!compressor.hasResults.value"
              @click="compressor.downloadAll"
            >
              Download all
            </button>
            <button
              type="button"
              class="text-[11px] px-2.5 py-1.5 rounded-lg text-brand-200 hover:text-brand-50"
              @click="compressor.reset"
            >
              Reset
            </button>
          </div>
        </div>

        <div v-if="compressor.hasResults.value" class="divide-y divide-surface-600">
          <ResultCard
            v-for="item in compressor.results.value"
            :key="item.id"
            :item="item"
            @remove="compressor.removeResult"
          />
        </div>
        <div v-else class="p-4 text-sm text-brand-200">No files.</div>
      </div>
    </div>
  </section>
</template>
