import { Box, Text } from '@chakra-ui/react'
import { Handle, NodeProps, Position } from 'react-flow-renderer'

export const SimpleNode = ({ data }: NodeProps<{ label: string }>) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        style={{ top: 10, bottom: 'auto', width: 10, height: 10, borderWidth: 2, backgroundColor: '#D53F8C' }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        style={{ width: 10, height: 10, borderWidth: 2, backgroundColor: '#D53F8C' }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="target-right"
        style={{ top: 10, bottom: 'auto', width: 10, height: 10, borderWidth: 2, backgroundColor: '#D53F8C' }}
      />

      <Box px={5} py={2} minW={200} maxW={300} border="2px" borderColor="gray.600" rounded="lg" bgColor="gray.50">
        <Text fontSize="sm" textAlign="center">
          {data.label}
        </Text>
      </Box>

      <Handle
        type="source"
        position={Position.Left}
        id="source-left"
        style={{ bottom: 0, top: 'auto', width: 10, height: 10, borderWidth: 2, backgroundColor: '#3182ce' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        style={{ width: 10, height: 10, borderWidth: 2, backgroundColor: '#3182ce' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        style={{ bottom: 0, top: 'auto', width: 10, height: 10, borderWidth: 2, backgroundColor: '#3182ce' }}
      />
    </>
  )
}
