import { Suspense, lazy } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClientProvider } from 'react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HomeRoute } from '@/routes/Home'
import { client } from '@/services/query-client'
import { theme } from '@/theme'

const DashboardRoute = lazy(() => import('@/routes/Dashboard').then((mod) => ({ default: mod.DashboardRoute })))
const SigninRoute = lazy(() => import('@/features/Auth').then((mod) => ({ default: mod.Signin })))
const SignupRoute = lazy(() => import('@/features/Auth').then((mod) => ({ default: mod.Signup })))
const AcceptInviteRoute = lazy(() => import('@/features/Auth').then((mod) => ({ default: mod.AcceptInvite })))
const PasswordRecoveryRoute = lazy(() => import('@/features/Auth').then((mod) => ({ default: mod.PasswordRecovery })))
const PasswordRecoveryConfirmationRoute = lazy(() =>
  import('@/features/Auth').then((mod) => ({ default: mod.PasswordRecoveryConfirmation })),
)
const MindMapRoute = lazy(() => import('@/routes/MindMap').then((mod) => ({ default: mod.MindMapRoute })))

export const App = () => {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <QueryClientProvider client={client}>
          <ChakraProvider theme={theme}>
            <Suspense fallback={<></>}>
              <Routes>
                <Route index element={<HomeRoute />} />

                <Route path="/sign-up" element={<SignupRoute />} />
                <Route path="/sign-in" element={<SigninRoute />} />
                <Route path="/forgot-password" element={<PasswordRecoveryRoute />} />
                <Route path="/reset-password" element={<PasswordRecoveryConfirmationRoute />} />
                <Route path="/sign-out" element={<></>} />
                <Route path="/invite" element={<AcceptInviteRoute />} />

                <Route path="/~/maps/*" element={<MindMapRoute />} />
                <Route path="/~/*" element={<DashboardRoute />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ChakraProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </BrowserRouter>
  )
}
