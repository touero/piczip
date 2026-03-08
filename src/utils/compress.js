import { nanoid } from '../utils/id.js'

const IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Failed to read the file'))
    reader.readAsDataURL(file)
  })

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Unable to load the image'))
    img.src = src
  })

const getCanvas = (width, height) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

export async function compressImage(file, options) {
  if (!IMAGE_MIME.includes(file.type)) {
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
  ctx.drawImage(image, 0, 0, targetWidth, targetHeight)

  const outputType = format === 'auto' ? file.type : format
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) return reject(new Error('Compression failed'))
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

function buildFileName(originalName, mime) {
  const extension = mime.split('/')[1] || 'image'
  const base = originalName.replace(/\.[^.]+$/, '')
  return `${base}-compressed.${extension}`
}

export function normalizeFiles(list) {
  return Array.from(list).filter((file) => IMAGE_MIME.includes(file.type))
}
