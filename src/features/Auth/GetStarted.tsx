import { Box } from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { Navigate } from 'react-router-dom'
import { Meta } from '@/components/Meta'
import { getCurrentSession } from '@/services/api'

export const GetStarted = () => {
  const sessionQuery = useQuery(['session', 'ping'], getCurrentSession, { retry: 0, cacheTime: 0 })

  return (
    <Box minW="100vw" minH="100vh" bg="gray.50">
      <Meta title="Get Started" />
      {sessionQuery.isError && <Navigate to="/sign-in" replace />}
      {sessionQuery.isSuccess && <Navigate to="/~" replace />}
    </Box>
  )
}
