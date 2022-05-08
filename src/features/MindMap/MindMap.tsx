import { memo } from 'react'
import { Box } from '@chakra-ui/react'
import ReactFlow, {
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from 'react-flow-renderer'
import { useMutation } from 'react-query'
import { useParams } from 'react-router'
import { deleteMindmapNodes, updateMindmapNode } from '@/services/api'
import { MindMapActions } from './Actions'
import { useMindMapSubscription } from './useMindMapSubscription'

const Flow = ({ workspace, id }: { workspace: string; id: string }) => {
  const { data, isSuccess } = useMindMapSubscription(workspace, id)
  const onNodeDragStop = useMutation((node: Node<{ label: string }>) => updateMindmapNode(workspace, id, node))
  const onNodesDelete = useMutation((nodes: Node<{ label: string }>[]) => deleteMindmapNodes(workspace, id, nodes))

  return (
    <>
      {isSuccess && (
        <MindMapFlow
          nodes={data.nodes.map((node) => JSON.parse(node) as Node)}
          edges={data.edges.map((edge) => JSON.parse(edge) as Edge)}
          onNodeDragStop={onNodeDragStop.mutate}
          onNodesDelete={onNodesDelete.mutate}
        />
      )}
    </>
  )
}

const FlowContainer = ({ workspace, id }: { workspace: string; id: string }) => {
  return (
    <ReactFlowProvider>
      <MindMapActions workspace={workspace} id={id} />
      <Flow workspace={workspace} id={id} />
    </ReactFlowProvider>
  )
}

const MindMapFlow = memo(
  ({
    nodes,
    edges,
    onNodeDragStop,
    onNodesDelete,
  }: {
    nodes: Node[]
    edges: Edge[]
    onNodeDragStop: (node: Node) => void
    onNodesDelete: (nodes: Node[]) => void
  }) => {
    const [n, , onNodesChange] = useNodesState(nodes)
    const [e, , onEdgesChange] = useEdgesState(edges)

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
        selectNodesOnDrag={false}
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    )
  },
)

MindMapFlow.displayName = 'MindMapFlow'

// const NodeListener = memo(({ workspace, id }: { workspace: string; id: string }) => {
//   const nodes = useNodes<{ label: string }>()
//   const queryClient = useQueryClient()
//   const data = queryClient.getQueryData<MindMapDocument>(['mind-map', workspace, id])
//   const { mutate } = useMutation(
//     (args: { workspace: string; id: string; data: MindMapDocument }) => {
//       return updateMindMap(args.workspace, args.id, args.data)
//     },
//     {
//       onMutate: async ({ workspace, id, data }) => {
//         await queryClient.cancelQueries(['mind-map', workspace, id])
//         const snapshot = queryClient.getQueryData<MindMapDocument>(['mind-map', workspace, id])

//         queryClient.setQueryData(['mind-map', workspace, id], data, { updatedAt: Date.now() })

//         return { snapshot }
//       },
//       onError: (_err, _data, context) => {
//         queryClient.setQueryData(['mind-map', workspace, id], context?.snapshot, { updatedAt: Date.now() })
//       },
//       onSuccess: () => {
//         void queryClient.invalidateQueries(['mind-map', workspace, id])
//       },
//     },
//   )

//   useEffect(() => {
//     if (!data) return

//     mutate({
//       workspace,
//       id,
//       data: {
//         ...data,
//         nodes: nodes.map(({ id, data, position, height, width, type }) =>
//           JSON.stringify({ id, data, position, height, width, type }),
//         ),
//         edges: [],
//       },
//     })
//   }, [data, id, nodes, mutate, workspace])

//   return <></>
// })

// NodeListener.displayName = 'NodeListener'

export const MindMap = () => {
  const { workspace, id } = useParams()

  return (
    <>
      <Box maxW="100vw" maxH="100vh" w="100vw" h="100vh" overflow="hidden">
        {workspace && id && <FlowContainer workspace={workspace} id={id} />}
      </Box>
    </>
  )
}
