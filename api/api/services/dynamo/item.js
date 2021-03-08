
const dynamoDocClient = require('serverless-dynamodb-client').doc

module.exports = {

   writeItem: async (item) => {

      const params = {
         TableName: process.env.ItemTable,
         Item: item
      }
   
      return dynamoDocClient.put(params).promise()
   },

   getItem: async (gameId, itemId) => {

      const params = {
         TableName: process.env.ItemTable,
         Key: {
            gameId: gameId,
            itemId: itemId
         }
      }

      const item = await dynamoDocClient.get(params).promise()
      return item.Item
   },

   updateItemReadyStatus: async (gameId, itemId, readyStatus) => {
      const params = {
         TableName: process.env.ItemTable,
         Key: {
            gameId: gameId,
            itemId: itemId
         },
         UpdateExpression: 'set readyStatus = :n',
         ConditionExpression: 'attribute_exists(gameId) AND attribute_exists(itemId)',
         ExpressionAttributeValues: {
            ':n': readyStatus
         },
         ReturnConsumedCapacity: 'NONE'
      }

      return dynamoDocClient.update(params).promise()  
   }
}
