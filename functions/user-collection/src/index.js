/// <reference types="../../functions" />
const sdk = require('node-appwrite')

/** @type {FunctionsHandler<sdk.Models.Collection | undefined>} */
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

  switch (req.env.APPWRITE_FUNCTION_EVENT) {
    case 'account.create':
    case 'users.create': {
      /** @type {sdk.Models.User<sdk.Models.Preferences>} **/
      const user = JSON.parse(req.env.APPWRITE_FUNCTION_EVENT_DATA)
      const collection = await database.createCollection(
        `user-${user.$id}`,
        user.name,
        'collection',
        [`user:${user.$id}`],
        [`user:${user.$id}`],
      )
      await Promise.all([
        database.createStringAttribute(collection.$id, 'name', 255, true),
        database.createStringAttribute(collection.$id, 'description', 1_000, false, ''),
        database.createStringAttribute(collection.$id, 'nodes', 1_000_000_000, true, undefined, true),
        database.createStringAttribute(collection.$id, 'edges', 1_000_000_000, true, undefined, true),
        database.createStringAttribute(collection.$id, 'tags', 1_000, false, undefined, true),
      ])

      return res.json(collection)
    }

    case 'account.update.name':
    case 'users.update.name': {
      /** @type {sdk.Models.User<sdk.Models.Preferences>} **/
      const user = JSON.parse(req.env.APPWRITE_FUNCTION_EVENT_DATA)
      const collection = await database.updateCollection(
        `user-${user.$id}`,
        user.name,
        'collection',
        [`user:${user.$id}`],
        [`user:${user.$id}`],
      )

      return res.json(collection)
    }

    case 'account.delete':
    case 'users.delete': {
      /** @type {sdk.Models.User<sdk.Models.Preferences>} **/
      const user = JSON.parse(req.env.APPWRITE_FUNCTION_EVENT_DATA)

      await database.deleteCollection(`user-${user.$id}`)

      return res.send('', 204)
    }

    default: {
      throw new Error('Unsupported trigger')
    }
  }
}

module.exports = handler
