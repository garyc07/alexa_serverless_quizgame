
const remoteApi = require('./api')
const gameTypes = require('../localData/gameTypes')

module.exports.gameItemsBuilder = async (gameId, gameType, gameDifficulty) => {

   let items = []
   let itemId = 1

   const type = gameTypes[gameType]
   if(!type){
      // Throw some error
   }


   if(process.env.NODE_ENV === 'test'){
      let testItems = require('./testData').items
      testItems.forEach(i => {
         i.gameId = gameId
      })
      return testItems
   }


   const sessionToken = await remoteApi.getSessionToken()

   for(const round of type.rounds){

      // Create start of round message
      items.push({
         gameId: gameId,
         itemId: itemId,
         message: 'Round Number ' + round.roundNumber // Add info on category and timer etc to this message
      })

      itemId++

      // TODO Create end of game item ++ End or round item

      const questions = await remoteApi.getQuestions(sessionToken, round.numQuestions, round.categoryId, gameDifficulty, round.questionType)

      let questionNumber = 1
      for(const question of questions){
         items.push({
            gameId: gameId,
            itemId: itemId,
            questionType: question.type,
            question: question.question,
            correctAnswer: question.correct_answer,
            incorrectAnswers: question.incorrect_answers,
            scoreValue: round.questionScore,
            roundNumber: round.roundNumber,
            questionNumber: questionNumber
         })

         itemId++
         questionNumber++
      }
      
   }

   return items
}