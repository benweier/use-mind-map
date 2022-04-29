import { memo, useEffect, useMemo } from 'react'
import { Box } from '@chakra-ui/react'
import ReactFlow, {
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  ReactFlowProvider,
  useEdgesState,
  useNodes,
  useNodesState,
  useReactFlow,
} from 'react-flow-renderer'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router'
import { getMindMap, subscribeToMindMap, updateMindMap } from '@/services/api'
import { MindMapDocument } from '@/services/appwrite'

export const useMindMapSubscription = (workspace: string, id: string) => {
  const queryClient = useQueryClient()
  const key = useMemo(() => ['mind-map', workspace, id], [id, workspace])
  const channel = useMemo(() => `collections.${workspace}.documents.${id}`, [id, workspace])

  useEffect(() => {
    subscribeToMindMap(channel, (response) => {
      if (response.event === 'database.documents.update') {
        queryClient.setQueryData(key, response.payload, { updatedAt: response.timestamp })
      }
    })
  }, [channel, id, key, queryClient])

  return useQuery(key, () => getMindMap(workspace, id), {
    cacheTime: Infinity,
    staleTime: Infinity,
    notifyOnChangeProps: ['data'],
  })
}

const Flow = ({ workspace, id }: { workspace: string; id: string }) => {
  const { data, isSuccess } = useMindMapSubscription(workspace, id)

  return (
    <>
      <NodeListener workspace={workspace} id={id} />
      {/* <NodeSync workspace={workspace} id={id} /> */}
      {isSuccess && (
        <MindMapFlow
          nodes={data.nodes.map((node) => JSON.parse(node) as Node)}
          edges={data.edges.map((edge) => JSON.parse(edge) as Edge)}
        />
      )}
    </>
  )
}

const FlowContainer = ({ workspace, id }: { workspace: string; id: string }) => {
  return (
    <ReactFlowProvider>
      <Flow workspace={workspace} id={id} />
    </ReactFlowProvider>
  )
}

const MindMapFlow = memo(({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
  const [n, setNodes, onNodesChange] = useNodesState(nodes)
  const [e, setEdges, onEdgesChange] = useEdgesState([
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3', animated: true },
  ])

  return (
    <ReactFlow nodes={n} edges={e} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}>
      <Background />
      <MiniMap />
      <Controls />
    </ReactFlow>
  )
})

MindMapFlow.displayName = 'MindMapFlow'

const NodeSync = memo(({ workspace, id }: { workspace: string; id: string }) => {
  const flow = useReactFlow()
  const queryClient = useQueryClient()
  const data = queryClient.getQueryData<MindMapDocument>(['mind-map', workspace, id])

  useEffect(() => {
    if (!data) return

    flow.setNodes(data.nodes.map((node) => JSON.parse(node) as Node))
  }, [data, flow])

  return <></>
})

NodeSync.displayName = 'NodeSync'

const NodeListener = memo(({ workspace, id }: { workspace: string; id: string }) => {
  const nodes = useNodes<{ label: string }>()
  const queryClient = useQueryClient()
  const data = queryClient.getQueryData<MindMapDocument>(['mind-map', workspace, id])
  const { mutate } = useMutation(
    (args: { workspace: string; id: string; data: MindMapDocument }) => {
      return updateMindMap(args.workspace, args.id, args.data)
    },
    {
      onMutate: async ({ workspace, id, data }) => {
        await queryClient.cancelQueries(['mind-map', workspace, id])
        const snapshot = queryClient.getQueryData<MindMapDocument>(['mind-map', workspace, id])

        queryClient.setQueryData(['mind-map', workspace, id], data, { updatedAt: Date.now() })

        return { snapshot }
      },
      onError: (_err, _data, context) => {
        queryClient.setQueryData(['mind-map', workspace, id], context?.snapshot, { updatedAt: Date.now() })
      },
      onSuccess: () => {
        void queryClient.invalidateQueries(['mind-map', workspace, id])
      },
    },
  )

  useEffect(() => {
    if (!data) return

    mutate({
      workspace,
      id,
      data: {
        ...data,
        nodes: nodes.map(({ id, data, position, height, width, type }) =>
          JSON.stringify({ id, data, position, height, width, type }),
        ),
        edges: [],
      },
    })
  }, [data, id, nodes, mutate, workspace])

  return <></>
})

NodeListener.displayName = 'NodeListener'

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
