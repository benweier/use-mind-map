import { memo, useCallback } from 'react'
import { Box, Button, Flex } from '@chakra-ui/react'
import { nanoid } from 'nanoid/non-secure'
import { Node, useReactFlow } from 'react-flow-renderer'
import { useMutation } from 'react-query'
import { createMindmapNode } from '@/services/api'

const createNode = (): Node<{ label: string }> => ({
  id: `node-${nanoid(9)}`,
  data: { label: '...' },
  position: {
    x: window.innerWidth / 2 - 125,
    y: window.innerHeight / 2,
  },
  width: 250,
})

export const MindMapActions = memo(({ workspace, id }: { workspace: string; id: string }) => {
  const { setNodes } = useReactFlow()
  const { mutate } = useMutation((node: Node<{ label: string }>) => createMindmapNode(workspace, id, node))

  const onAdd = useCallback(() => {
    const node = createNode()

    setNodes((nodes) => nodes.concat(node))
    mutate(node)
  }, [mutate, setNodes])

  return (
    <Box
      position="absolute"
      zIndex={999}
      top={0}
      left={0}
      right={0}
      p={4}
      bgColor="white"
      roundedBottom="xl"
      boxShadow="lg"
    >
      <Flex alignItems="center" gap={4}>
        <Button variant="primary" onClick={onAdd}>
          Add Node
        </Button>
      </Flex>
    </Box>
  )
})

MindMapActions.displayName = 'MindMapActions'
