import { Flex, Icon } from '@chakra-ui/react'
import { EdgeProps, getBezierPath, getEdgeCenter, useReactFlow } from 'react-flow-renderer'
import { HiOutlineHand } from 'react-icons/hi'

export const SimpleEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const { setEdges } = useReactFlow()
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  })

  return (
    <>
      <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
      <foreignObject
        width={20}
        height={20}
        x={edgeCenterX - 20 / 2}
        y={edgeCenterY - 20 / 2}
        className="edge-button-delete"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <Flex
          justify="center"
          alignItems="center"
          onClick={() => setEdges((edges) => edges.filter((edge) => edge.id === id))}
          bgColor="white"
        >
          <Icon as={HiOutlineHand} color="gray.400" fontSize={20} p={1} />
        </Flex>
      </foreignObject>
    </>
  )
}
