const dynamoDocClient = require('serverless-dynamodb-client').doc


module.exports = {

   writePlayerItem: async (item) => {

      const params = {
         TableName: process.env.PlayerTable,
         Item: item
      }
   
      return dynamoDocClient.put(params).promise()
   },


   getPlayerItem: async (gameId, playerId) => {
      const params = {
         TableName: process.env.PlayerTable,
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
         TableName: process.env.PlayerTable,
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
         TableName: process.env.PlayerTable,
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
   },

   updateLastItemId: async (player) => {
      const params = {
         TableName: process.env.PlayerTable,
         Key: {
            gameId: player.gameId,
            playerId: player.playerId
         },
         UpdateExpression: 'set lastItemId = :n',
         ConditionExpression: 'attribute_exists(gameId) AND attribute_exists(playerId)',
         ExpressionAttributeValues: {
            ':n': player.lastItemId
         },
         ReturnConsumedCapacity: 'NONE'
      }

      return dynamoDocClient.update(params).promise()  
   }
}
