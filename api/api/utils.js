const jwt = require('jsonwebtoken')
const APIError = require('./services/errors/APIError')

module.exports = {


   validateBodyParamProps: (requestBody, requiredParamProps) => {
      for(let param of requiredParamProps){
         if(!requestBody.hasOwnProperty(param)){
            throw new APIError(422, param + ' is required')
         }
      }
   },

   generateToken: (groupId, gameId, playerId) => {
      return jwt.sign({
         groupId: groupId,
         gameId: gameId,
         playerId: playerId,
         exp: 10000000000000,
      }, 'secret', {
         //issuer: 'MLGGC',
         //algorithm: "RS256"
      })
   }
}