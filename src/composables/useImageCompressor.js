import { computed, ref } from 'vue'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { compressImage, normalizeFiles } from '../utils/compress.js'
import { nanoid } from '../utils/id.js'

const DEFAULT_OPTIONS = {
  quality: 50,
  maxDimension: 512,
  format: 'auto',
}

export function useImageCompressor() {
  const queue = ref([])
  const results = ref([])
  const errors = ref([])
  const isProcessing = ref(false)
  const progress = ref(0)
  const options = ref({ ...DEFAULT_OPTIONS })

  const hasQueue = computed(() => queue.value.length > 0)
  const hasResults = computed(() => results.value.length > 0)

  const summary = computed(() => {
    const totals = results.value.reduce(
      (acc, item) => {
        acc.original += item.originalSize
        acc.compressed += item.compressedSize
        return acc
      },
      { original: 0, compressed: 0 }
    )

    const saved = Math.max(totals.original - totals.compressed, 0)
    const reduction = totals.original
      ? Math.max(0, (1 - totals.compressed / totals.original) * 100)
      : 0

    return {
      ...totals,
      saved,
      reduction,
      count: results.value.length,
    }
  })

  const addFiles = (fileList) => {
    const normalized = normalizeFiles(fileList)
    const mapped = normalized.map((file) => ({ id: nanoid(), file }))
    queue.value = [...queue.value, ...mapped]
    if (normalized.length === 0) {
      errors.value = ['Only JPEG, PNG, WebP, or AVIF images are supported.']
    }
  }

  const removeFromQueue = (id) => {
    queue.value = queue.value.filter((item) => item.id !== id)
  }

  const reset = () => {
    queue.value = []
    results.value = []
    errors.value = []
    progress.value = 0
    isProcessing.value = false
  }

  const compressAll = async () => {
    if (!queue.value.length) return

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
        errors.value.push(`${item.file.name}: ${error.message}`)
      }
      progress.value = Math.round(((index + 1) / queue.value.length) * 100)
    }

    isProcessing.value = false
  }

  const downloadAll = async () => {
    if (!results.value.length) return
    const zip = new JSZip()
    results.value.forEach((item) => {
      zip.file(item.name, item.blob)
    })

    const archive = await zip.generateAsync({ type: 'blob' })
    saveAs(archive, `piczip-${new Date().toISOString().slice(0, 10)}.zip`)
  }

  const removeResult = (id) => {
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
