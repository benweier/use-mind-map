import { Models } from 'node-appwrite'

type NodeAttributes = 'position' | 'label' | 'size'
type EdgeAttributes = 'source' | 'target'

declare type MindMapNodeEventType = `node.create` | `node.update.${NodeAttributes}` | `node.delete`
declare type MindMapEdgeEventType = `edge.create` | `edge.update.${EdgeAttributes}` | `edge.delete`

declare interface MindMapReference {
  collection: string
  document: string
}

declare interface MindMapCreateNodeEvent extends MindMapReference {
  type: 'node.create'
  node: {
    id: string
    data: { label: string }
    position: { x: number; y: number }
    width: number
    height: number
  }
}

declare interface MindMapMoveNodeEvent extends MindMapReference {
  type: 'node.update.position'
  node: {
    id: string
    position: { x: number; y: number }
  }
}

declare interface MindMapResizeNodeEvent extends MindMapReference {
  type: 'node.update.size'
  node: {
    id: string
    width: number
    height: number
  }
}

declare interface MindMapDeleteNodeEvent extends MindMapReference {
  type: 'node.delete'
  nodes: string[]
}

declare type MindMapEventPayload =
  | MindMapCreateNodeEvent
  | MindMapMoveNodeEvent
  | MindMapResizeNodeEvent
  | MindMapDeleteNodeEvent

declare interface MindMapDocument extends Models.Document {
  name: string
  description: string
  nodes: string[]
  edges: string[]
  tags: string[]
}
