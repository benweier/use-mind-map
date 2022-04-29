import { FC, PropsWithChildren, useEffect } from 'react'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import useRoutingInstrumentation from 'react-router-v6-instrumentation'

export const SentryInstrumentation: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const routingInstrumentation = useRoutingInstrumentation()

  useEffect(() => {
    Sentry.init({
      dsn: '',
      integrations: [
        new Integrations.BrowserTracing({
          routingInstrumentation,
        }),
      ],
      enabled: process.env.NODE_ENV === 'production',
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.01,
    })
  }, [routingInstrumentation])

  return <>{children}</>
}
