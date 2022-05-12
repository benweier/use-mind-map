/// <reference types="../../functions" />
/// <reference types="../mindmap-nodes" />

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
      /** @type {MindMapEventPayload} */
      const data = JSON.parse(req.env.APPWRITE_FUNCTION_DATA)

      switch (data.type) {
        case 'node.create': {
          /** @type {MindMapDocument} */
          const mindmap = await database.getDocument(data.collection, data.document)
          const nodes = mindmap.nodes.concat(JSON.stringify(data.node))

          await database.updateDocument(data.collection, data.document, { nodes })

          return res.send('', 204)
        }

        case 'node.update.position': {
          /** @type {MindMapDocument} */
          const mindmap = await database.getDocument(data.collection, data.document)
          const nodes = mindmap.nodes.map((n) => {
            /** @type {import('react-flow-renderer').Node} */
            const node = JSON.parse(n)

            if (node.id === data.node.id) {
              return JSON.stringify({
                ...node,
                position: {
                  x: data.node.position.x,
                  y: data.node.position.y,
                },
              })
            }

            return n
          })

          await database.updateDocument(data.collection, data.document, { nodes })

          return res.send('', 204)
        }

        case 'node.update.label': {
          /** @type {MindMapDocument} */
          const mindmap = await database.getDocument(data.collection, data.document)
          const nodes = mindmap.nodes.map((n) => {
            /** @type {import('react-flow-renderer').Node} */
            const node = JSON.parse(n)

            if (node.id === data.node.id) {
              return JSON.stringify({
                ...node,
                data: data.node.data,
              })
            }

            return n
          })

          await database.updateDocument(data.collection, data.document, { nodes })

          return res.send('', 204)
        }

        case 'node.update.size': {
          /** @type {MindMapDocument} */
          const mindmap = await database.getDocument(data.collection, data.document)
          const nodes = mindmap.nodes.map((n) => {
            /** @type {import('react-flow-renderer').Node} */
            const node = JSON.parse(n)

            if (node.id === data.node.id) {
              return JSON.stringify({
                ...node,
                width: data.node.width,
                height: data.node.height,
              })
            }

            return n
          })

          await database.updateDocument(data.collection, data.document, { nodes })

          return res.send('', 204)
        }

        case 'node.delete': {
          /** @type {MindMapDocument} */
          const mindmap = await database.getDocument(data.collection, data.document)

          const nodes = mindmap.nodes.filter((n) => {
            /** @type {import('react-flow-renderer').Node} */
            const node = JSON.parse(n)

            return !data.nodes.includes(node.id)
          })

          const edges = mindmap.edges.filter((n) => {
            /** @type {import('react-flow-renderer').Edge} */
            const edge = JSON.parse(n)

            return !data.nodes.includes(edge.source) && !data.nodes.includes(edge.target)
          })

          await database.updateDocument(data.collection, data.document, { nodes, edges })

          return res.send('', 204)
        }
      }
    }

    default:
      throw new Error('Unsupported trigger')
  }
}

module.exports = handler
