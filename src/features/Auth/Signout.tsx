import { useEffect } from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { deleteCurrentSession } from '@/services/api'

export const Signout = () => {
  const navigate = useNavigate()
  const { mutate } = useMutation(deleteCurrentSession, {
    onSuccess: () => {
      navigate('/', { replace: true })
    },
  })

  useEffect(() => {
    mutate()
  }, [mutate])

  return <></>
}
