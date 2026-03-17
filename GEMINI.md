# Clover Analyzer — Project Specification

> Gerenciador de arquivos para macOS que escaneia o disco, identifica arquivos pesados e ajuda o usuário a liberar espaço com inteligência e uma interface elegante.

---

## Identidade do Projeto

| Campo | Valor |
|---|---|
| **Nome** | Clover Analyzer |
| **Símbolo** | Trevo de 4 folhas |
| **Plataforma** | macOS (via Electron) |
| **Inspirações** | DaisyDisk, CleanMyMac (módulo de limpeza de disco) |
| **Tema visual** | Dark — verde escuro, fundo #0d0f0e |

---

## Stack Tecnológica

### Runtime
- **Bun** — substitui o Node.js como runtime e package manager. Usar `bun` em vez de `npm`/`node` em todos os scripts. Verificar compatibilidade com módulos nativos do Electron antes de usar APIs específicas do Bun.

### Framework Principal
- **Electron** — app desktop para macOS. Dois processos:
  - **Main Process** — Node.js/Bun, acesso total ao sistema de arquivos
  - **Renderer Process** — interface React, sem acesso direto ao FS

### Build
- **electron-vite** — wrapper que configura Vite + Electron + React automaticamente
- **Vite** — bundler do renderer process
- **TypeScript** — obrigatório em todo o projeto

### Frontend
- **React** (com TypeScript) — UI do renderer process
- **Tailwind CSS** — estilização, sem CSS custom salvo exceções pontuais
- **Shadcn/ui** — componentes de UI (usa Radix UI internamente). Instalar via `bunx shadcn-ui@latest init`

### Visualização de Dados
- **D3.js** — treemap interativo do disco. Escolhido por oferecer controle total sobre o visual e animações. Não usar Recharts ou outras alternativas.

### Gerenciamento de Estado
- **Zustand** — store global leve. Um store principal `useScanStore` para o estado do scan.

---

## Inicialização do Projeto

```bash
# Criar projeto com electron-vite
bunx create-electron-vite@latest clover-analyzer --template react-ts

cd clover-analyzer

# Instalar dependências com bun
bun install

# Adicionar dependências principais
bun add d3 zustand
bun add -d @types/d3

# Inicializar Shadcn
bunx shadcn-ui@latest init

# Instalar componentes Shadcn que serão usados
bunx shadcn-ui@latest add button badge scroll-area tooltip

# Rodar em desenvolvimento
bun run dev
```

---

## Estrutura de Pastas

```
clover-analyzer/
├── src/
│   ├── main/                        ← Main Process (acesso ao FS)
│   │   ├── index.ts                 ← Entry point do Electron
│   │   ├── scanner.ts               ← Lógica de scan recursivo
│   │   ├── ipc-handlers.ts          ← Pontes main ↔ renderer via IPC
│   │   ├── file-categories.ts       ← Classificação de arquivos por categoria
│   │   └── file-utils.ts            ← Helpers: formatação de tamanho, datas
│   │
│   ├── preload/
│   │   └── index.ts                 ← Expõe APIs seguras ao renderer (contextBridge)
│   │
│   └── renderer/
│       ├── index.html
│       ├── App.tsx
│       ├── main.tsx
│       │
│       ├── stores/
│       │   └── useScanStore.ts      ← Zustand store principal
│       │
│       ├── components/
│       │   ├── Layout/
│       │   │   └── AppShell.tsx     ← Layout raiz (sidebar + main)
│       │   ├── Titlebar/
│       │   │   └── Titlebar.tsx     ← Barra de título customizada (dots macOS)
│       │   ├── Sidebar/
│       │   │   ├── Sidebar.tsx
│       │   │   ├── DiskInfo.tsx     ← Barra de uso do disco
│       │   │   ├── DeviceList.tsx   ← Lista de volumes montados
│       │   │   └── CategoryList.tsx ← Filtros por categoria
│       │   ├── FileList/
│       │   │   ├── FileList.tsx     ← Lista principal de arquivos
│       │   │   ├── FileItem.tsx     ← Item individual com barra de tamanho
│       │   │   └── Toolbar.tsx      ← Breadcrumb + opções de ordenação
│       │   ├── TreeMap/
│       │   │   ├── TreeMap.tsx      ← Componente D3 treemap
│       │   │   └── TreeMapCell.tsx  ← Célula individual do treemap
│       │   └── StatsPanel/
│       │       └── StatsPanel.tsx   ← Cards de resumo (pode limpar, total, etc.)
│       │
│       └── hooks/
│           ├── useScanner.ts        ← Hook que invoca o IPC de scan
│           └── useTreeMap.ts        ← Hook D3 para construir o layout do treemap
│
├── electron.vite.config.ts
├── electron-builder.yml             ← Configuração de distribuição macOS
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Interface — Especificação Visual Exata

### Paleta de Cores

```css
/* Backgrounds */
--bg-root:     #0d0f0e   /* fundo geral do app */
--bg-titlebar: #111412   /* barra de título e sidebar */
--bg-hover:    #141a14   /* hover em itens da lista */
--bg-selected: #1a2419   /* item selecionado */
--bg-card:     #1a2419   /* cards de stats */
--bg-card-warn:#2a2010   /* card com aviso laranja */

/* Bordas */
--border-main: #2a3028   /* divisores principais */
--border-card: #2a3a2a   /* bordas de cards */

/* Texto */
--text-primary:  #e8ede9  /* texto principal */
--text-muted:    #9eb89f  /* texto secundário */
--text-subtle:   #4a6b4c  /* labels, paths */

/* Acento verde (identidade Clover) */
--green-bright: #7dc97f
--green-mid:    #4a9e5c
--green-dark:   #3d8a4e
--green-deep:   #2d6e3a

/* Cores de categoria de arquivo */
--cat-video:    #c0704a  /* vídeos e renders */
--cat-docs:     #4a7ab8  /* documentos */
--cat-images:   #8a4ab8  /* imagens */
--cat-audio:    #b8944a  /* áudio */
--cat-other:    #4a8a5a  /* outros */
```

### Tipografia

- **Display / UI:** `Syne` (Google Fonts) — pesos 400, 500, 600, 700
- **Monospace (tamanhos, paths):** `DM Mono` (Google Fonts) — pesos 400, 500

### Layout Geral

```
┌─────────────────────────────────────────────────────────┐
│  TITLEBAR  [● ● ●]        Clover Analyzer    [logo]     │
├──────────────┬──────────────────────────────────────────┤
│              │  TOOLBAR  breadcrumb     [↓ Maior primeiro]│
│   SIDEBAR    ├─────────────────────────┬────────────────┤
│              │                         │                │
│  Dispositivos│   FILE LIST             │   RIGHT PANEL  │
│  Categorias  │   (lista scrollável)    │   - Treemap D3 │
│              │                         │   - Stats cards│
│  [Disk Info] │                         │                │
└──────────────┴─────────────────────────┴────────────────┘
```

**Dimensões:**
- Sidebar: `220px` de largura fixa
- Right Panel: `280px` de largura fixa
- File List: flex restante
- Altura mínima do app: `600px`

### Titlebar

- Background: `#111412`
- Border-bottom: `0.5px solid #2a3028`
- Traffic lights macOS (dots) à esquerda: vermelho `#ff5f57`, amarelo `#febc2e`, verde `#28c840`
- Logo Clover (SVG trevo 4 folhas) centralizado com o nome "Clover Analyzer"
- Fonte do título: `Syne 13px 500`, cor `#7a9e7c`, letra-spacing `0.04em`
- O app deve usar `frame: false` no Electron para titlebar customizada

### Sidebar

Background: `#111412`, border-right: `0.5px solid #2a3028`

**Seção "Dispositivos":**
- Label: `10px`, `font-weight: 600`, `letter-spacing: 0.12em`, `#4a6b4c`, uppercase
- Items: `13px Syne`, padding `8px 10px`, border-radius `8px`
- Estado ativo: background `#1e2b1f`, cor `#7dc97f`
- Hover: background `#1e2b1f`, cor `#c8e6c9`
- Ícones SVG inline (monitor para HD, celular para iCloud)

**Seção "Categorias":**
- Mesmo padrão de label
- Items com dot colorido (8px, border-radius 50%) representando a categoria
- Cores dos dots: conforme `--cat-*` acima

**DiskInfo Card** (parte inferior da sidebar):
- Background: `#1a2419`, border: `0.5px solid #2a3a2a`, border-radius: `10px`
- Nome do disco: `13px Syne 600`, cor `#c8e6c9`
- Subtítulo (SSD · APFS): `11px`, cor `#5a7a5c`
- Barra de progresso: altura `5px`, bg `#2a3a2a`, fill com gradiente `#4a9e5c → #7dc97f`
- Stats: usado em `#7dc97f` (DM Mono), livre em `#5a7a5c` (DM Mono)

### Toolbar

- Padding: `16px 24px`
- Border-bottom: `0.5px solid #1e2b1f`
- Breadcrumb: `DM Mono 12px`, cor `#4a6b4c`, pasta atual em `#7dc97f`
- Botão de ordenação: background `#1a2419`, border `0.5px solid #2a3a2a`, cor `#9eb89f`, `Syne 12px`, border-radius `6px`

### File List

Cada item da lista (`FileItem`) contém:

1. **Ícone** — emoji representando o tipo de arquivo (20px, centralizado)
2. **Info** (flex 1):
   - Nome: `Syne 13px`, cor `#c8e6c9`, `text-overflow: ellipsis`
   - Path: `DM Mono 11px`, cor `#4a6b4c`, `text-overflow: ellipsis`
3. **Barra + Badge** (120px):
   - Barra: `3px altura`, bg `#2a3a2a`, fill colorido conforme categoria
   - Badge: `10px 600`, padding `2px 8px`, border-radius `4px`
     - Aviso: bg `#2a2010`, cor `#c8942a`, border `0.5px solid #3a3010`
     - OK: bg `#102010`, cor `#4a9e5c`, border `0.5px solid #1a3a1a`
4. **Tamanho** (70px, texto à direita): `DM Mono 12px`, cor da categoria
5. **Botão de ação** (28px × 28px): lixeira ou seta de abrir, aparece no hover

Separador entre itens: `border-bottom: 0.5px solid #141a14`

### Right Panel — Treemap (D3.js)

- Border-left: `0.5px solid #1e2b1f`
- Padding: `20px`
- Label "Mapa de disco": `10px 600 uppercase`, `#4a6b4c`, `letter-spacing: 0.1em`

O treemap é renderizado com **D3.js** usando `d3.treemap()`:
- Layout: células rectangulares com gap de `3px`
- Border-radius nas células: `8px`
- Cada célula mostra: nome da categoria + tamanho em GB e porcentagem
- Fonte das células: nome `11px 600 rgba(255,255,255,0.9)`, tamanho `10px DM Mono rgba(255,255,255,0.55)`
- Cores das células: variações escuras das cores de categoria
- Interativo: hover reduz opacity para `0.85`
- Célula maior ocupa a largura total (span 2 no grid ou célula dominante no treemap)

### Right Panel — Stats Cards

Grid 2×2 de cards:

| Card | Valor de exemplo | Cor |
|---|---|---|
| Pode limpar | 143 GB | `#c0704a` |
| Total usado | 341 GB | `#7dc97f` |
| Arquivos | 48.2k | `#9eb89f` |
| Pastas | 3.1k | `#9eb89f` |

Style dos cards: bg `#1a2419`, border `0.5px solid #2a3a2a`, border-radius `8px`, padding `12px`
- Label: `10px`, cor `#4a6b4c`
- Valor: `18px 700 DM Mono`

---

## Lógica Principal — Scanner

### IPC Channels

```typescript
// main → renderer
'scan:progress'   // { scanned: number, current: string }
'scan:complete'   // FileNode (árvore completa)
'scan:error'      // { message: string }

// renderer → main
'scan:start'      // { path: string }
'scan:cancel'     // void
'file:delete'     // { path: string }
'file:reveal'     // { path: string } → abre no Finder
```

### Estrutura de Dados Principal

```typescript
interface FileNode {
  name: string
  path: string
  size: number          // bytes
  isDirectory: boolean
  lastAccessed: Date
  lastModified: Date
  category: FileCategory
  children?: FileNode[] // só se isDirectory
}

type FileCategory =
  | 'video'
  | 'image'
  | 'audio'
  | 'document'
  | 'archive'
  | 'code'
  | 'application'
  | 'cache'
  | 'system'
  | 'other'
```

### Zustand Store

```typescript
interface ScanStore {
  // Estado
  status: 'idle' | 'scanning' | 'complete' | 'error'
  rootNode: FileNode | null
  flatFiles: FileNode[]        // lista ordenada por tamanho
  selectedFile: FileNode | null
  activeCategory: FileCategory | null
  sortBy: 'size' | 'name' | 'date'
  progress: { scanned: number; current: string }

  // Actions
  startScan: (path: string) => void
  cancelScan: () => void
  selectFile: (file: FileNode) => void
  setCategory: (category: FileCategory | null) => void
  setSortBy: (sort: 'size' | 'name' | 'date') => void
  deleteFile: (path: string) => Promise<void>
  revealInFinder: (path: string) => void
}
```

---

## Categorias Inteligentes

O scanner deve detectar automaticamente e classificar como "pode limpar":

| Tipo | Detecção | Badge |
|---|---|---|
| `node_modules` | Pasta com esse nome exato | "pode ser regenerado" |
| Docker images | `~/Library/Containers/com.docker.docker` | "images antigas" |
| Caches do sistema | `~/Library/Caches/*` | "cache antigo" |
| Backups do iPhone | `~/Library/Application Support/MobileSync` | "backup antigo" |
| Renders do Final Cut | `~/Movies/**/*.fcpbundle` internals | "não acessado há X meses" |
| Homebrew cache | `$(brew --cache)` | "cache antigo" |
| Lixeira | `~/.Trash` | "pode ser limpa" |
| `.DS_Store` files | arquivos com esse nome | "arquivo do sistema" |

---

## Configuração do Electron

### `electron.vite.config.ts`
```typescript
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: { /* config do main process */ },
  preload: { /* config do preload */ },
  renderer: {
    plugins: [react()],
    // Tailwind via PostCSS
  }
})
```

### `main/index.ts` — configurações importantes
```typescript
const win = new BrowserWindow({
  width: 1200,
  height: 700,
  minWidth: 900,
  minHeight: 600,
  frame: false,           // titlebar customizada
  titleBarStyle: 'hidden',
  vibrancy: 'under-window', // efeito macOS
  visualEffectState: 'active',
  webPreferences: {
    preload: join(__dirname, '../preload/index.js'),
    contextIsolation: true,
    nodeIntegration: false,
  }
})
```

### Permissões macOS (`Info.plist` / `electron-builder.yml`)
O app precisa de acesso a pastas protegidas. Configurar:
```yaml
# electron-builder.yml
mac:
  entitlements: build/entitlements.mac.plist
  entitlementsInherit: build/entitlements.mac.plist
  hardenedRuntime: true
```

```xml
<!-- build/entitlements.mac.plist -->
<key>com.apple.security.files.user-selected.read-write</key>
<true/>
<key>com.apple.security.files.downloads.read-write</key>
<true/>
```

---

## Fases de Desenvolvimento

### Fase 1 — Fundação (MVP)
- [ ] Configurar projeto (electron-vite + bun + TypeScript)
- [ ] Instalar e configurar Tailwind, Shadcn, D3, Zustand
- [ ] Implementar `scanner.ts` com scan recursivo
- [ ] Criar IPC channels básicos
- [ ] Interface mínima: sidebar + lista de arquivos ordenada por tamanho

### Fase 2 — Interface Completa
- [ ] Implementar todos os componentes conforme especificação visual
- [ ] Titlebar customizada com traffic lights
- [ ] Treemap com D3.js interativo
- [ ] Animação de progresso durante o scan
- [ ] Cards de stats

### Fase 3 — Inteligência
- [ ] Detecção automática de "lixo comum" (node_modules, caches, etc.)
- [ ] Badges contextuais por tipo de arquivo
- [ ] Filtros por categoria na sidebar
- [ ] Cálculo de "último acesso" e sugestões baseadas nisso

### Fase 4 — Ações
- [ ] Mover para lixeira do macOS (com confirmação)
- [ ] "Limpar selecionados" com seleção múltipla
- [ ] Revelar no Finder
- [ ] Histórico de ações (desfazer)

### Fase 5 — Distribuição
- [ ] Code signing da Apple
- [ ] Notarization (obrigatório fora da Mac App Store)
- [ ] Auto-update via `electron-updater`
- [ ] Ícone do app (trevo 4 folhas em formato .icns)

---

## Observações Técnicas

- **Bun + Electron:** Testar compatibilidade com módulos nativos (`fs`, `path`). O Bun pode ter limitações com alguns addons nativos do Node — documentar qualquer incompatibilidade encontrada.
- **Performance do scan:** Para discos grandes, o scan pode ser lento. Implementar scan em chunks com `yield` ou workers, enviando progresso via IPC em tempo real para a UI atualizar conforme escaneia.
- **Segurança:** Nunca expor `ipcRenderer` diretamente — sempre usar `contextBridge` no preload para criar uma API segura (`window.electronAPI`).
- **Pastas protegidas no macOS:** `~/Library` e subpastas podem requerer permissão explícita do usuário via dialog de permissão do macOS na primeira execução.
