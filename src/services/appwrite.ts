import { env } from '@/config/env.client'
import { Appwrite, Models } from 'appwrite'

type MindMapCollectionType = 'user' | 'team'

export type MindMapCollectionID = `${MindMapCollectionType}-${string}`

export interface MindMapDocument extends Models.Document {
  name: string
  description: string
  nodes: string[]
  edges: string[]
  tags: string[]
}

export const appwrite = new Appwrite()

appwrite.setEndpoint(env.APPWRITE_ENDPOINT).setProject(env.APPWRITE_PROJECT_ID)
