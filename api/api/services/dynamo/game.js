const dynamoDocClient = require('serverless-dynamodb-client').doc

module.exports = {

   createNewGame: async (gameOpts) => {

      const params = {
         TableName: process.env.GameTable,
         Item: gameOpts
      }
   
      return dynamoDocClient.put(params).promise()
   },

   getGame: async (groupId, gameId) => {
      const params = {
         TableName: process.env.GameTable,
         Key: {
            groupId: groupId,
            gameId: gameId
         }
      }

      const result = await dynamoDocClient.get(params).promise()
      return result.Item
   },

   getGroupGames: async (groupId) => {
      const params = {
         TableName: process.env.GameTable,
         KeyConditionExpression: 'groupId = :groupId',
         ExpressionAttributeValues: { 
            ':groupId': groupId
         },
         ReturnConsumedCapacity: 'NONE'
      }

      const result = await dynamoDocClient.query(params).promise()
      return result.Items
   }
}
