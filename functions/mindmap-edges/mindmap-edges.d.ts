import { Models } from 'node-appwrite'

type NodeAttributes = 'position' | 'label' | 'size'
type EdgeAttributes = 'connection'

declare type MindMapEdgeEventType = `edge.create` | `edge.update.${EdgeAttributes}` | `edge.delete`

declare interface MindMapReference {
  collection: string
  document: string
}

declare interface MindMapCreateEdgeEvent extends MindMapReference {
  type: 'edge.create'
  edge: {
    id: string
    source: string
    target: string
  }
}

declare interface MindMapMoveEdgeEvent extends MindMapReference {
  type: 'edge.update.connection'
  edge: {
    id: string
    source: string
    target: string
  }
}

declare interface MindMapDeleteEdgeEvent extends MindMapReference {
  type: 'edge.delete'
  edges: string[]
}

declare type MindMapEdgeEventPayload = MindMapCreateEdgeEvent | MindMapMoveEdgeEvent | MindMapDeleteEdgeEvent

declare interface MindMapDocument extends Models.Document {
  name: string
  description: string
  nodes: string[]
  edges: string[]
  tags: string[]
}
