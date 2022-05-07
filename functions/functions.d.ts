declare interface FunctionsRequest {
  headers: Record<string, string>
  payload: string
  env: Record<string, string>
}

declare interface FunctionsResponse<T extends Record<string, any> = Record<string, unknown>> {
  send: (body: string, status?: number) => void
  json: (body: T, status?: number) => void
}

declare interface FunctionsHandler<P> {
  (req: FunctionsRequest, res: FunctionsResponse<P>): Promise<void>
}

declare interface GetGravatar {
  (value: string): string
}
