import { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'

export const Meta = ({ title, children }: { title: string; children?: ReactNode }) => {
  return (
    <Helmet titleTemplate="%s | useMindMap">
      <title>{title}</title>
      {children}
    </Helmet>
  )
}
