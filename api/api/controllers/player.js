const utils = require('../utils')
const {itemStore, playerStore} = require('../services/dynamo/index')

module.exports.list = async (req, res, next) => {

   const allPlayers = await playerStore.getAllForGame(req.query.gameId)

   const players = allPlayers.map((player) => {
      return {
         gameId: player.gameId,
         playerId: player.playerId, 
         playerName: player.playerName
      }
   })

   res.json({players: players})

}

module.exports.editName = async (req, res, next) => {

   const body = req.body

   const requiredParams = ['gameId', 'playerId', 'newName']
   utils.validateBodyParamProps(body, requiredParams)

   try{

      await playerStore.updateName(body.gameId, body.playerId, body.newName)
      res.json({newName: body.newName})

   } catch(err){

      if(err.code === 'ConditionalCheckFailedException'){
         return res.status(400).send({error: 'Player ID: ' + body.playerId + ' does not exist for Game ID: ' + body.gameId})
      }
      next(err)
   }
}


module.exports.select = async (req, res, next) => {


   const body = req.body
   const requiredParams = ['gameId', 'playerId']
   utils.validateBodyParamProps(body, requiredParams)

   try{
      
      const token = utils.generateToken(null, body.gameId, body.playerId)
      res.json({token: token})

   } catch(err){
      
      if(err.code === 'ConditionalCheckFailedException'){
         return res.status(400).send({error: 'Player ID: ' + body.playerId + ' does not exist for Game ID: ' + body.gameId})
      }

      next(err)
   }
}


module.exports.submit = async (req, res, next) => {

   const body = req.body
   utils.validateBodyParamProps(body, ['itemId'])

   // Get all players for this game. Required to check individual player statuses
   const allPlayers = await playerStore.getAllForGame(req.payload.gameId)

   // Get the player record of the players making the submission
   const thisPlayer = allPlayers.find(p => p.playerId === req.payload.playerId)

   const questionItem = await itemStore.getItem(req.payload.gameId, parseInt(body.itemId))


   // If the item submitted on is a message only item. Update the player lastItemId only
   if(questionItem.message){

      thisPlayer.lastItemId = questionItem.itemId
      await playerStore.updateLastItemId(thisPlayer)

   } else {

      // If the item submitted on is a question check the answer and update accordingly

      // Shape of object added to the thisPlayer.questions array 
      let playerQuestion = {
         question: questionItem.question,
         playerAnswer: body.answer.toLowerCase(),
         correctAnswer: questionItem.correctAnswer,
         correct: false
      }

      // Check answer and update thisPlayer score accordingly
      if(playerQuestion.playerAnswer === questionItem.correctAnswer.toLowerCase()){
         thisPlayer.totalScore += questionItem.scoreValue
         playerQuestion.correct = true
      }

      // Update the player.question array with the latest submission and answer
      thisPlayer.questions.push(playerQuestion)

      // Set the last submitted ItemId. Used to determine readiness to proceed
      thisPlayer.lastItemId = questionItem.itemId

      await playerStore.writePlayerItem(thisPlayer)
   }


   // Update Game Item Status, based on player submissions
   let updateItemStatus = true
   for(const player of allPlayers){
      if(player.lastItemId !== questionItem.itemId){
         updateItemStatus = false
      }
   }

   if(updateItemStatus){
      await itemStore.updateItemReadyStatus(req.payload.gameId, questionItem.itemId + 1, true)
   }


   res.json({good: 'Y'}) // Return 'nextItem' url??


}


module.exports.quit = async (req, res, next) => {

   // Allow players to quit from web app during game 
   // Set player status for game to continue
   // Stop user session updates
}