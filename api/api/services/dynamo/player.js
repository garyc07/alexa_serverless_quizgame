const dynamoDocClient = require('serverless-dynamodb-client').doc


module.exports = {

   writePlayerItem: async (item) => {

      const params = {
         TableName: 'familyquiz-player-table',
         Item: item
      }
   
      return dynamoDocClient.put(params).promise()
   },


   getPlayerItem: async (gameId, playerId) => {
      const params = {
         TableName: 'familyquiz-player-table',
         Key: {
            gameId: gameId,
            playerId: playerId
         }
      }

      const playerItem = await dynamoDocClient.get(params).promise()
      return playerItem.Item

   },


   getAllForGame: async (gameId) => {

      const params = {
         TableName: 'familyquiz-player-table',
         KeyConditionExpression: 'gameId = :gameId',
         ExpressionAttributeValues: { 
            ':gameId': gameId
         },
         ReturnConsumedCapacity: 'NONE'
      }

      const players = await dynamoDocClient.query(params).promise()
      return players.Items
   },

   updateName: async (gameId, playerId, newName) => {

      //let ret = {}
      const params = {
         TableName: 'familyquiz-player-table',
         Key: {
            gameId: gameId,
            playerId: playerId,
         },
         UpdateExpression: 'set playerName = :n',
         ConditionExpression: 'attribute_exists(gameId) AND attribute_exists(playerId)',
         ExpressionAttributeValues: {
            ':n': newName
         },
         ReturnConsumedCapacity: 'NONE'
      }

      return dynamoDocClient.update(params).promise()

/*       await dynamoDocClient.update(params, (err, res) => {
         ret.err = err
         console.log(err.code)
      }) */

/*       await dynamoDocClient.update(params).promise().catch(err => {
         ret.err = err
      }) */

/*       try{
         const res = await dynamoDocClient.update(params).promise()
         return new DynamoResult(null, res)
      } catch(err){
         return new DynamoResult(err.code, null)
      } */

      //return ret
   },


   setPlayerReadyStatus: async (gameId, playerId, readyStatus) => {
      const params = {
         TableName: 'familyquiz-player-table',
         Key: {
            gameId: gameId,
            playerId: playerId,
         },
         UpdateExpression: 'set readyStatus = :n',
         ConditionExpression: 'attribute_exists(gameId) AND attribute_exists(playerId)',
         ExpressionAttributeValues: {
            ':n': readyStatus
         },
         ReturnConsumedCapacity: 'NONE'
      }

      return dynamoDocClient.update(params).promise()
   }
}
