import { Navigate, Route, Routes } from 'react-router'
import { MindMap } from '@/features/MindMap'
import { MindMapLayout } from '@/layouts/MindMap'

export const MindMapRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<MindMapLayout />}>
        <Route index element={<></>} />

        <Route path=":workspace/:id" element={<MindMap />} />

        <Route path="*" element={<Navigate to="." replace />} />
      </Route>
    </Routes>
  )
}
