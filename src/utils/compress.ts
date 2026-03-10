import { nanoid } from './id'

export const IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const

export type SupportedImageMime = (typeof IMAGE_MIME)[number]
export type OutputFormat = SupportedImageMime | 'auto'

export interface CompressionOptions {
  quality: number
  maxDimension: number
  format: OutputFormat
}

export interface CompressionMeta {
  name: string
  type: SupportedImageMime
  originalSize: number
  compressedSize: number
  ratio: number
  width: number
  height: number
}

export interface CompressedImage {
  id: string
  url: string
  blob: Blob
  file: File
  meta: CompressionMeta
}

const readAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Failed to read the file'))
    }
    reader.onerror = () => reject(new Error('Failed to read the file'))
    reader.readAsDataURL(file)
  })

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Unable to load the image'))
    img.src = src
  })

const getCanvas = (width: number, height: number): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

const isSupportedMime = (type: string): type is SupportedImageMime =>
  IMAGE_MIME.includes(type as SupportedImageMime)

export async function compressImage(file: File, options: CompressionOptions): Promise<CompressedImage> {
  if (!isSupportedMime(file.type)) {
    throw new Error('Unsupported file type')
  }

  const { quality, maxDimension, format } = options
  const dataUrl = await readAsDataUrl(file)
  const image = await loadImage(dataUrl)

  const limit = Math.max(maxDimension || image.width, 1)
  const scale = Math.min(limit / image.width, limit / image.height, 1)
  const targetWidth = Math.round(image.width * scale)
  const targetHeight = Math.round(image.height * scale)

  const canvas = getCanvas(targetWidth, targetHeight)
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Canvas is not available')
  }

  ctx.drawImage(image, 0, 0, targetWidth, targetHeight)

  const outputType = (format === 'auto' ? file.type : format) as SupportedImageMime
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error('Compression failed'))
          return
        }

        resolve(result)
      },
      outputType,
      quality / 100
    )
  })

  const compressedFile = new File([blob], buildFileName(file.name, outputType), { type: outputType })

  return {
    id: nanoid(),
    url: URL.createObjectURL(compressedFile),
    blob,
    file: compressedFile,
    meta: {
      name: compressedFile.name,
      type: outputType,
      originalSize: file.size,
      compressedSize: compressedFile.size,
      ratio: file.size > 0 ? (1 - compressedFile.size / file.size) * 100 : 0,
      width: targetWidth,
      height: targetHeight,
    },
  }
}

function buildFileName(originalName: string, mime: SupportedImageMime): string {
  const extension = mime.split('/')[1] || 'image'
  const base = originalName.replace(/\.[^.]+$/, '')
  return `${base}-compressed.${extension}`
}

export function normalizeFiles(list: FileList | File[]): File[] {
  return Array.from(list).filter((file): file is File => isSupportedMime(file.type))
}
