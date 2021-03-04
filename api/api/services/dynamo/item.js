
const dynamoDocClient = require('serverless-dynamodb-client').doc

module.exports = {

   writeItem: async (item) => {

      const params = {
         TableName: 'familyquiz-item-table',
         Item: item
      }
   
      return dynamoDocClient.put(params).promise()
   },

   getItem: async (gameId, itemId) => {

      const params = {
         TableName: 'familyquiz-item-table',
         Key: {
            gameId: gameId,
            itemId: itemId
         }
      }

      const item = await dynamoDocClient.get(params).promise()
      return item.Item
   }
}
