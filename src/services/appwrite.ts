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

appwrite.setEndpoint('https://api.usemindmap.app/v1').setProject('62627b181ca61dc83009')
