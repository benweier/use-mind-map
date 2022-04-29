import { ReportHandler } from 'web-vitals'

export const reportWebVitals = async (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    const { getCLS, getFCP, getFID, getLCP, getTTFB } = await import('web-vitals')

    getCLS(onPerfEntry)
    getFID(onPerfEntry)
    getFCP(onPerfEntry)
    getLCP(onPerfEntry)
    getTTFB(onPerfEntry)
  }
}
