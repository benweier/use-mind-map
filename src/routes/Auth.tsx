import { Container } from '@chakra-ui/react'
import { Navigate, Route, Routes } from 'react-router'
import { Signin, Signup } from '@/features/Auth'

export const AuthRoute = () => {
  return (
    <>
      <Container maxW="md" py={{ base: 12, md: 24 }}>
        <Routes>
          <Route path="/">
            <Route index element={<Navigate to="sign-up" replace />} />

            <Route path="sign-up" element={<Signup />} />
            <Route path="sign-in" element={<Signin />} />
            <Route path="sign-out" element={<></>} />

            <Route path="*" element={<Navigate to="register" replace />} />
          </Route>
        </Routes>
      </Container>
    </>
  )
}
