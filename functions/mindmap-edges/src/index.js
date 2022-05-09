/// <reference types="../../functions" />
/// <reference types="../mindmap-edges" />

const sdk = require('node-appwrite')

/** @type {FunctionsHandler<sdk.Models.Document | undefined>} */
const handler = async (req, res) => {
  if (
    ![
      req.env.APPWRITE_FUNCTION_ENDPOINT,
      req.env.APPWRITE_FUNCTION_PROJECT_ID,
      req.env.APPWRITE_FUNCTION_API_KEY,
    ].every(Boolean)
  ) {
    throw new Error('Environment variables are not set')
  }

  const client = new sdk.Client()
  const database = new sdk.Database(client)

  client
    .setEndpoint(req.env.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(req.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.env.APPWRITE_FUNCTION_API_KEY)
    .setSelfSigned(true)

  switch (req.env.APPWRITE_FUNCTION_TRIGGER) {
    case 'http': {
      /** @type {MindMapEdgeEventPayload} */
      const data = JSON.parse(req.env.APPWRITE_FUNCTION_DATA)

      switch (data.type) {
        case 'edge.create': {
          /** @type {MindMapDocument} */
          const mindmap = await database.getDocument(data.collection, data.document)
          const edges = mindmap.edges.concat(JSON.stringify(data.edge))

          await database.updateDocument(data.collection, data.document, { edges })

          return res.send('', 204)
        }

        case 'edge.update.connection': {
          /** @type {MindMapDocument} */
          const mindmap = await database.getDocument(data.collection, data.document)
          const edges = mindmap.edges.map((n) => {
            /** @type {import('react-flow-renderer').Edge} */
            const edge = JSON.parse(n)

            if (edge.id === data.edge.id) {
              return JSON.stringify(edge)
            }

            return n
          })

          await database.updateDocument(data.collection, data.document, { edges })

          return res.send('', 204)
        }

        case 'edge.delete': {
          /** @type {MindMapDocument} */
          const mindmap = await database.getDocument(data.collection, data.document)
          const edges = mindmap.edges.filter((n) => {
            /** @type {import('react-flow-renderer').Edge} */
            const edge = JSON.parse(n)

            return !data.edges.includes(edge.id)
          })

          await database.updateDocument(data.collection, data.document, { edges })

          return res.send('', 204)
        }
      }
    }

    default:
      throw new Error('Unsupported trigger')
  }
}

module.exports = handler
