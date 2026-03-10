import { computed, ref } from 'vue'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { compressImage, normalizeFiles, type CompressionOptions, type OutputFormat } from '../utils/compress'
import { nanoid } from '../utils/id'

export interface QueueItem {
  id: string
  file: File
}

export interface ResultItem {
  id: string
  url: string
  blob: Blob
  name: string
  format: OutputFormat
  width: number
  height: number
  originalName: string
  originalSize: number
  compressedSize: number
  ratio: number
}

interface Summary {
  original: number
  compressed: number
  saved: number
  reduction: number
  count: number
}

const DEFAULT_OPTIONS: CompressionOptions = {
  quality: 50,
  maxDimension: 512,
  format: 'auto',
}

export function useImageCompressor() {
  const queue = ref<QueueItem[]>([])
  const results = ref<ResultItem[]>([])
  const errors = ref<string[]>([])
  const isProcessing = ref(false)
  const progress = ref(0)
  const options = ref<CompressionOptions>({ ...DEFAULT_OPTIONS })

  const hasQueue = computed(() => queue.value.length > 0)
  const hasResults = computed(() => results.value.length > 0)

  const summary = computed<Summary>(() => {
    const totals = results.value.reduce(
      (acc, item) => {
        acc.original += item.originalSize
        acc.compressed += item.compressedSize
        return acc
      },
      { original: 0, compressed: 0 }
    )

    const saved = Math.max(totals.original - totals.compressed, 0)
    const reduction = totals.original ? Math.max(0, (1 - totals.compressed / totals.original) * 100) : 0

    return {
      ...totals,
      saved,
      reduction,
      count: results.value.length,
    }
  })

  const addFiles = (fileList: FileList | File[]) => {
    const normalized = normalizeFiles(fileList)
    const mapped = normalized.map((file) => ({ id: nanoid(), file }))
    queue.value = [...queue.value, ...mapped]

    if (normalized.length === 0) {
      errors.value = ['Only JPEG, PNG, WebP, or AVIF images are supported.']
      return
    }

    errors.value = []
  }

  const removeFromQueue = (id: string) => {
    queue.value = queue.value.filter((item) => item.id !== id)
  }

  const reset = () => {
    results.value.forEach((item) => URL.revokeObjectURL(item.url))
    queue.value = []
    results.value = []
    errors.value = []
    progress.value = 0
    isProcessing.value = false
  }

  const compressAll = async () => {
    if (!queue.value.length) {
      return
    }

    results.value.forEach((item) => URL.revokeObjectURL(item.url))
    isProcessing.value = true
    progress.value = 0
    errors.value = []
    results.value = []

    for (let index = 0; index < queue.value.length; index += 1) {
      const item = queue.value[index]

      try {
        const compressed = await compressImage(item.file, options.value)
        results.value.push({
          id: compressed.id,
          url: compressed.url,
          blob: compressed.blob,
          name: compressed.meta.name,
          format: compressed.meta.type,
          width: compressed.meta.width,
          height: compressed.meta.height,
          originalName: item.file.name,
          originalSize: item.file.size,
          compressedSize: compressed.meta.compressedSize,
          ratio: compressed.meta.ratio,
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        errors.value.push(`${item.file.name}: ${message}`)
      }

      progress.value = Math.round(((index + 1) / queue.value.length) * 100)
    }

    isProcessing.value = false
  }

  const downloadAll = async () => {
    if (!results.value.length) {
      return
    }

    const zip = new JSZip()
    results.value.forEach((item) => {
      zip.file(item.name, item.blob)
    })

    const archive = await zip.generateAsync({ type: 'blob' })
    saveAs(archive, `piczip-${new Date().toISOString().slice(0, 10)}.zip`)
  }

  const removeResult = (id: string) => {
    const target = results.value.find((item) => item.id === id)
    if (target) {
      URL.revokeObjectURL(target.url)
    }

    results.value = results.value.filter((item) => item.id !== id)
  }

  return {
    queue,
    results,
    errors,
    options,
    isProcessing,
    progress,
    summary,
    hasQueue,
    hasResults,
    addFiles,
    removeFromQueue,
    reset,
    compressAll,
    downloadAll,
    removeResult,
  }
}
