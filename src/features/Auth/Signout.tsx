import { useEffect } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { deleteCurrentSession } from '@/services/api'

export const Signout = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate } = useMutation(deleteCurrentSession, {
    onSuccess: () => {
      queryClient.invalidateQueries()
      navigate('/', { replace: true })
    },
  })

  useEffect(() => {
    mutate()
  }, [mutate])

  return <></>
}
