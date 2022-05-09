import { useEffect, useMemo } from 'react'
import { Edge, Node, useReactFlow } from 'react-flow-renderer'
import { useQuery, useQueryClient } from 'react-query'
import { getMindMap, subscribeToMindMap } from '@/services/api'

export const useMindMapSubscription = (workspace: string, id: string) => {
  const { setNodes, setEdges } = useReactFlow()
  const queryClient = useQueryClient()
  const key = useMemo(() => ['mind-map', workspace, id], [id, workspace])
  const channel = useMemo(() => `collections.${workspace}.documents.${id}`, [id, workspace])

  useEffect(() => {
    subscribeToMindMap(channel, (response) => {
      if (response.event === 'database.documents.update') {
        const nodes = response.payload.nodes.map((node) => JSON.parse(node) as Node)
        const edges = response.payload.edges.map((edge) => JSON.parse(edge) as Edge)
        queryClient.setQueryData(key, response.payload, { updatedAt: response.timestamp })
        setNodes(nodes)
        setEdges(edges)
      }
    })
  }, [channel, id, key, queryClient, setEdges, setNodes])

  return useQuery(key, () => getMindMap(workspace, id), {
    cacheTime: Infinity,
    staleTime: Infinity,
    notifyOnChangeProps: ['data'],
  })
}
