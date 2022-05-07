/// <reference types="../../functions" />

const crypto = require('crypto')
const sdk = require('node-appwrite')

/** @type {GetGravatar} */
const getGravatarURL = (value) => {
  const hash = crypto.createHash('md5').update(value).digest('hex')
  const gravatar = new URL(`https://www.gravatar.com/avatar/${hash}`)

  gravatar.searchParams.set('d', 'identicon')

  return gravatar.toString()
}

/** @type {FunctionsHandler<undefined>} */
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
  const users = new sdk.Users(client)

  client
    .setEndpoint(req.env.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(req.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.env.APPWRITE_FUNCTION_API_KEY)
    .setSelfSigned(true)

  switch (req.env.APPWRITE_FUNCTION_EVENT) {
    case 'account.create':
    case 'users.create': {
      /** @type {sdk.Models.User<{ gravatar: string}>} **/
      const payload = JSON.parse(req.env.APPWRITE_FUNCTION_EVENT_DATA)
      const gravatar = getGravatarURL(payload.email)

      await users.updatePrefs(payload.$id, { gravatar })

      return res.send('', 204)
    }

    default: {
      throw new Error('Unsupported trigger')
    }
  }
}

module.exports = handler
