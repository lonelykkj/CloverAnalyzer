import { FileCategory } from './types'

const CATEGORY_MAP: Record<FileCategory, string[]> = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff'],
  video: ['mp4', 'mov', 'mkv', 'avi', 'wmv', 'flv', 'webm', 'm4v'],
  audio: ['mp3', 'wav', 'flac', 'm4a', 'aac', 'ogg', 'wma'],
  document: ['pdf', 'docx', 'txt', 'xlsx', 'pptx', 'pages', 'numbers', 'key', 'epub', 'md'],
  archive: ['zip', 'rar', '7z', 'tar', 'gz', 'pkg', 'dmg', 'iso'],
  code: ['ts', 'js', 'cs', 'py', 'html', 'css', 'json', 'cpp', 'h', 'swift', 'go', 'rs', 'php'],
  application: ['app', 'exe', 'msi'],
  cache: [], // Lógica especial para pastas de cache será adicionada depois
  system: ['sys', 'dll', 'so', 'dylib'],
  other: []
}

// Invertendo o mapa para busca rápida O(1)
const EXTENSION_TO_CATEGORY: Record<string, FileCategory> = {}

Object.entries(CATEGORY_MAP).forEach(([category, extensions]) => {
  extensions.forEach((ext) => {
    EXTENSION_TO_CATEGORY[ext] = category as FileCategory
  })
})

/**
 * Detecta a categoria de um arquivo baseando-se na sua extensão.
 */
export function detectCategory(filePath: string): FileCategory {
  const ext = filePath.split('.').pop()?.toLowerCase()
  if (!ext) return 'other'
  return EXTENSION_TO_CATEGORY[ext] || 'other'
}
