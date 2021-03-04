const uuid = require('uuid')

module.exports = {

   generateId: () => {
      return uuid.v1()
   },

   generateQuizName: () => {
      return Math.random().toString(36).substring(5).toUpperCase()
   }
}