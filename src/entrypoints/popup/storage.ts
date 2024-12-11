import { storage } from 'wxt/storage'

export interface UserTool {
  category?: string
  name: string
  url: string
}

export const userTools = storage.defineItem<UserTool[]>('local:userTools', {
  fallback: [],
  version: 1,
})
