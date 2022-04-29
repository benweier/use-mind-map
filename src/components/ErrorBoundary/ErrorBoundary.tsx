import { FC, ReactNode, cloneElement, isValidElement } from 'react'
import { FallbackProps, ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'

const ErrorFallback: FC<Partial<FallbackProps>> = () => {
  return <></>
}

export const ErrorBoundary = ({
  component = <ErrorFallback />,
  onReset,
  children,
}: {
  component?: ReactNode | FC<Partial<FallbackProps>>
  onReset?: () => void
  children?: ReactNode
}) => (
  <ReactErrorBoundary
    onReset={onReset}
    fallbackRender={({ error, resetErrorBoundary }) =>
      isValidElement(component) ? cloneElement(component, { error, resetErrorBoundary }) : <></>
    }
  >
    {children}
  </ReactErrorBoundary>
)
