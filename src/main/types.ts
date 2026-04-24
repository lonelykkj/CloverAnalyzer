export type FileCategory = 
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

export interface FileNode{
    name: string
    path: string
    size: number
    isDirectory: boolean
    lastAccessed: Date
    lastModified: Date
    category: FileCategory
    children?: FileNode[]
}

export interface ScanProgress{
    scanned: number
    current: string
}