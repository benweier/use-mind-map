import { memo, useCallback } from 'react'
import { Box, Button, Input, Stack, Text } from '@chakra-ui/react'
import { Node } from 'react-flow-renderer'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { updateMindmapNode } from '@/services/api'

interface NodeEditorFormState {
  label: string
}

export const MindMapNodeEditor = memo(
  ({ workspace, id, node, onSuccess }: { workspace: string; id: string; node: Node | null; onSuccess: () => void }) => {
    const { register, handleSubmit } = useForm<NodeEditorFormState>({
      defaultValues: {
        label: node?.data.label ?? '',
      },
    })
    const { mutateAsync, isLoading } = useMutation(
      ({ values, node }: { values: NodeEditorFormState; node: Node }) => {
        return updateMindmapNode(workspace, id, 'node.update.label', {
          id: node.id,
          data: { label: values.label },
          position: node.position,
          width: node.width,
          height: node.height,
        })
      },
      { onSuccess },
    )
    const onSubmit = useCallback<SubmitHandler<NodeEditorFormState>>(
      (values) => {
        if (!node) {
          return Promise.reject(new Error('Invalid node'))
        }

        return mutateAsync({ values, node })
      },
      [mutateAsync, node],
    )

    if (!node) return <></>

    return (
      <Box
        position="absolute"
        zIndex={999}
        w={300}
        maxW={300}
        right={10}
        top={100}
        p={6}
        border="1px"
        borderColor="gray.200"
        bgColor="white"
        rounded="xl"
        boxShadow="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column" spacing={2}>
            <Stack direction="column" spacing={4}>
              <Input {...register('label')} autoFocus />
              <Button type="submit" variant="primary" disabled={isLoading}>
                Save
              </Button>
            </Stack>
            <Text fontSize="xs" color="gray.400" textAlign="center">
              Node ID: {node.id}
            </Text>
          </Stack>
        </form>
      </Box>
    )
  },
)

MindMapNodeEditor.displayName = 'MindMapNodeEditor'
