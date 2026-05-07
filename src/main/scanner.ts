import { promises as fs } from 'fs'
import { join } from 'path'
import { BrowserWindow } from 'electron'
import { FileNode } from './types'
import { Semaphore } from './utils/semaphore'
import { detectCategory } from './file-categories'

const semaphore = new Semaphore(50)

/**
 * Inicia o scan recursivo de um diretório.
 */
export async function scanDirectory(dirPath: string, win: BrowserWindow): Promise<FileNode> {
  return await walk(dirPath, win)
}

/**
 * Função recursiva que navega pelo sistema de arquivos.
 */
async function walk(filePath: string, win: BrowserWindow): Promise<FileNode> {
  await semaphore.acquire()

  try {
    const stat = await fs.stat(filePath)
    semaphore.release()

    const name = filePath.split('/').pop() || filePath

    if (!stat.isDirectory()) {
      return {
        name,
        path: filePath,
        size: stat.size,
        isDirectory: false,
        lastAccessed: stat.atime,
        lastModified: stat.mtime,
        category: detectCategory(filePath)
      }
    }

    // É um diretório - lê os filhos
    let entries: string[] = []
    try {
      entries = await fs.readdir(filePath)
    } catch {
      // Sem permissão para listar - retorna pasta vazia
      return {
        name,
        path: filePath,
        size: 0,
        isDirectory: true,
        lastAccessed: stat.atime,
        lastModified: stat.mtime,
        category: 'system',
        children: []
      }
    }

    // Processa todos os filhos em paralelo
    const children = await Promise.all(
      entries.map((entry) => walk(join(filePath, entry), win))
    )

    // Tamanho da pasta = soma recursiva de tudo dentro dela
    const totalSize = children.reduce((sum, child) => sum + child.size, 0)

    return {
      name,
      path: filePath,
      size: totalSize,
      isDirectory: true,
      lastAccessed: stat.atime,
      lastModified: stat.mtime,
        category: 'other',
      children
    }
  } catch (error) {
    semaphore.release()
    // Erro ao ler stats (arquivo deletado durante scan ou permissão)
    return {
      name: filePath.split('/').pop() || filePath,
      path: filePath,
      size: 0,
      isDirectory: false,
      lastAccessed: new Date(),
      lastModified: new Date(),
      category: 'system'
    }
  }
}