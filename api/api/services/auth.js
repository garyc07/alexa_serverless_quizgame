const jwt = require('express-jwt')

const auth = {
   required: jwt({
      secret: 'secret',
      algorithms: ['HS256', 'RS256'],
      userProperty: 'payload',
   }),
   optional: jwt({
      secret: 'secret',
      algorithms: ['HS256', 'RS256'],
      userProperty: 'payload',
      credentialsRequired: false,
   })
}

module.exports = auth