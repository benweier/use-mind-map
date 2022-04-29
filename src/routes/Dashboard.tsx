import { useQuery } from 'react-query'
import { Navigate, Route, Routes } from 'react-router'
import * as Dashboard from '@/features/Dashboard'
import { DashboardLayout } from '@/layouts/Dashboard'
import { getAccount } from '@/services/api'

export const DashboardRoute = () => {
  const accountQuery = useQuery(['account'], getAccount)

  if (accountQuery.isLoading) return <></>

  if (accountQuery.isError) return <Navigate to="/auth" replace />

  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard.Activity />} />

        <Route path="profile">
          <Route index element={<Dashboard.Profile />} />
          <Route path=":id" element={<Dashboard.ProfileWorkspace />} />
        </Route>

        <Route path="teams">
          <Route index element={<Dashboard.Teams />} />
          <Route path=":id" element={<Dashboard.TeamWorkspace />} />
        </Route>

        <Route path="*" element={<Navigate to="." replace />} />
      </Route>
    </Routes>
  )
}
