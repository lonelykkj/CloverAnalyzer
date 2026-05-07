import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { promises as fs } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { scanDirectory } from './scanner'

describe('Scanner', () => {
  let testDirPath: string

  // Setup: Cria uma pasta temporária com arquivos antes de cada teste
  beforeEach(async () => {
    testDirPath = await fs.mkdtemp(join(tmpdir(), 'clover-test-'))
    
    // Criar estrutura de teste:
    // /test-dir/file1.txt (1000 bytes)
    // /test-dir/subdir/file2.txt (500 bytes)
    await fs.writeFile(join(testDirPath, 'file1.txt'), Buffer.alloc(1000))
    await fs.mkdir(join(testDirPath, 'subdir'))
    await fs.writeFile(join(testDirPath, 'subdir', 'file2.txt'), Buffer.alloc(500))
  })

  // Teardown: Remove a pasta temporária depois de cada teste
  afterEach(async () => {
    await fs.rm(testDirPath, { recursive: true, force: true })
  })

  it('deve calcular corretamente o tamanho total de um diretório', async () => {
    // Act: Chama o scanner (que ainda não existe!)
    // Passamos um mock simplificado do BrowserWindow para o scanner enviar progresso
    const mockWin = { webContents: { send: () => {} } } as any
    const result = await scanDirectory(testDirPath, mockWin)

    // Assert: O tamanho total deve ser 1000 + 500 = 1500 bytes
    expect(result.size).toBe(1500)
    expect(result.isDirectory).toBe(true)
    expect(result.children?.length).toBe(2)
  })

  it('deve identificar corretamente a categoria dos arquivos', async () => {
    const mockWin = { webContents: { send: () => {} } } as any
    const result = await scanDirectory(testDirPath, mockWin)
    
    // No nosso caso, .txt deve ser mapeado para 'document' ou 'other'
    // Vamos verificar se o primeiro arquivo foi processado
    const file1 = result.children?.find(c => c.name === 'file1.txt')
    expect(file1).toBeDefined()
    expect(file1?.size).toBe(1000)
  })
})
