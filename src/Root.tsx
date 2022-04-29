import { StrictMode, Suspense, lazy } from 'react'

const App = lazy(() => import('@/components/App').then((mod) => ({ default: mod.App })))

export const Root = () => (
  <StrictMode>
    <Suspense fallback={<></>}>
      <App />
    </Suspense>
  </StrictMode>
)
