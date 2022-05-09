import { memo } from 'react'
import { Box } from '@chakra-ui/react'
import { nanoid } from 'nanoid/non-secure'
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  Node,
  ReactFlowProvider,
  addEdge,
  updateEdge,
  useEdgesState,
  useNodesState,
} from 'react-flow-renderer'
import { useMutation } from 'react-query'
import { useParams } from 'react-router'
import {
  createMindmapEdge,
  deleteMindmapEdges,
  deleteMindmapNodes,
  updateMindmapEdge,
  updateMindmapNode,
} from '@/services/api'
import { MindMapActions } from './Actions'
import { useMindMapSubscription } from './useMindMapSubscription'

const createEdge = (source: string, target: string): Edge => ({
  id: `edge-${nanoid(9)}`,
  source,
  target,
})

const Flow = ({ workspace, id }: { workspace: string; id: string }) => {
  const { data, isSuccess } = useMindMapSubscription(workspace, id)
  const onNodeDragStop = useMutation((node: Node<{ label: string }>) => updateMindmapNode(workspace, id, node))
  const onNodesDelete = useMutation((nodes: Node<{ label: string }>[]) => deleteMindmapNodes(workspace, id, nodes))
  const onEdgeCreate = useMutation(async (edge: Edge) => createMindmapEdge(workspace, id, edge))
  const onEdgeUpdateEnd = useMutation(async (edge: Edge) => updateMindmapEdge(workspace, id, edge))
  const onEdgesDelete = useMutation(async (edges: Edge[]) => deleteMindmapEdges(workspace, id, edges))

  return (
    <>
      {isSuccess && (
        <MindMapFlow
          workspace={workspace}
          id={id}
          nodes={data.nodes.map((node) => JSON.parse(node) as Node)}
          edges={data.edges.map((edge) => JSON.parse(edge) as Edge)}
          onNodeDragStop={onNodeDragStop.mutate}
          onNodesDelete={onNodesDelete.mutate}
          onEdgeCreate={onEdgeCreate.mutate}
          onEdgeUpdateEnd={onEdgeUpdateEnd.mutate}
          onEdgesDelete={onEdgesDelete.mutate}
        />
      )}
    </>
  )
}

const MindMapFlow = memo(
  ({
    workspace,
    id,
    nodes,
    edges,
    onNodeDragStop,
    onNodesDelete,
    onEdgeCreate,
    onEdgeUpdateEnd,
    onEdgesDelete,
  }: {
    workspace: string
    id: string
    nodes: Node[]
    edges: Edge[]
    onEdgeCreate: (edge: Edge) => void
    onEdgeUpdateEnd: (edge: Edge) => void
    onEdgesDelete: (edges: Edge[]) => void
    onNodeDragStop: (node: Node) => void
    onNodesDelete: (nodes: Node[]) => void
  }) => {
    const [n, , onNodesChange] = useNodesState(nodes)
    const [e, setEdges, onEdgesChange] = useEdgesState(edges)
    const onEdgeUpdate = (oldEdge: Edge, newConnection: Connection) => {
      setEdges((edge) => {
        return updateEdge(oldEdge, newConnection, edge)
      })
    }
    const onConnect = ({ source, target }: Connection) => {
      if (source && target) {
        setEdges((edges) => {
          const edge = createEdge(source, target)
          onEdgeCreate(edge)
          return addEdge(edge, edges)
        })
      }
    }

    return (
      <ReactFlow
        snapToGrid
        snapGrid={[10, 10]}
        nodes={n}
        edges={e}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={(_event, node) => onNodeDragStop(node)}
        onNodesDelete={onNodesDelete}
        onConnect={onConnect}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateEnd={(_event, edge) => onEdgeUpdateEnd(edge)}
        onEdgesDelete={onEdgesDelete}
        selectNodesOnDrag={false}
      >
        <MindMapActions workspace={workspace} id={id} />
        <Background />
        <Controls />
      </ReactFlow>
    )
  },
)

MindMapFlow.displayName = 'MindMapFlow'

export const MindMap = () => {
  const { workspace, id } = useParams()

  return (
    <>
      <Box maxW="100vw" maxH="100vh" w="100vw" h="100vh" overflow="hidden">
        {workspace && id && (
          <ReactFlowProvider>
            <Flow workspace={workspace} id={id} />
          </ReactFlowProvider>
        )}
      </Box>
    </>
  )
}
