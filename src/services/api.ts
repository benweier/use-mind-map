import { Node } from 'react-flow-renderer'
import { env } from '@/config/env.client'
import { RealtimeResponseEvent } from 'appwrite'
import { MindMapCollectionID, MindMapDocument, appwrite } from './appwrite'

export const getAccount = () => appwrite.account.get<{ gravatar: string }>()

export const deleteCurrentSession = () => appwrite.account.deleteSession('current')

export const listTeams = () => appwrite.teams.list()

export const listMindMaps = (id: MindMapCollectionID) => appwrite.database.listDocuments<MindMapDocument>(id)

export const createTeam = (name: string) => appwrite.teams.create('unique()', name)

export const createMindMap = (collection: MindMapCollectionID, name: string) =>
  appwrite.database.createDocument(collection, 'unique()', {
    name,
    description: '',
    nodes: [],
    edges: [],
    tags: [],
  })

export const subscribeToMindMap = (channel: string, cb: (response: RealtimeResponseEvent<MindMapDocument>) => void) =>
  appwrite.subscribe<MindMapDocument>(channel, cb)

export const getMindMap = (workspace: string, id: string) =>
  appwrite.database.getDocument<MindMapDocument>(workspace, id)

export const updateMindMap = (workspace: string, id: string, data: MindMapDocument) =>
  appwrite.database.updateDocument<MindMapDocument>(workspace, id, data)

export const deleteMindMap = (workspace: string, id: string) => appwrite.database.deleteDocument(workspace, id)

export const inviteTeamMember = (team: string, email: string, name: string) =>
  appwrite.teams.createMembership(team, email, [], `${window.location.origin}/invite`, name)

export const getTeamMembers = (id: string) => appwrite.teams.getMemberships(id)

export const updateMindmapNode = (collection: string, document: string, node: Node<{ label: string }>) =>
  appwrite.functions.createExecution(
    env.APPWRITE_FUNCTION_MINDMAP,
    JSON.stringify({
      collection,
      document,
      type: 'node.update.position',
      node: {
        id: node.id,
        data: node.data,
        position: node.position,
        width: node.width,
        height: node.height,
      },
    }),
  )

export const deleteMindmapNodes = (collection: string, document: string, nodes: Node<{ label: string }>[]) =>
  appwrite.functions.createExecution(
    env.APPWRITE_FUNCTION_MINDMAP,
    JSON.stringify({
      collection,
      document,
      type: 'node.delete',
      nodes: nodes.map((node) => node.id),
    }),
  )
