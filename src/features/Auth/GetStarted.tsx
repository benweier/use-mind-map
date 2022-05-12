import { Box } from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { Navigate } from 'react-router-dom'
import { Meta } from '@/components/Meta'
import { getAccount } from '@/services/api'

export const GetStarted = () => {
  const accountQuery = useQuery(['account'], getAccount, { retry: 0 })

  return (
    <Box minW="100vw" minH="100vh" bg="gray.50">
      <Meta title="Get Started" />
      {accountQuery.isError && <Navigate to="/sign-in" replace />}
      {accountQuery.isSuccess && <Navigate to="/~" replace />}
    </Box>
  )
}
