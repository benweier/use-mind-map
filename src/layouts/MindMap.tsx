import { Flex } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'

export const MindMapLayout = () => (
  <Flex as="section" minH="100vh" minW="100vw" bg="white">
    <Outlet />
  </Flex>
)
