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

      await playerStore.setPlayerReadyStatus(body.gameId, body.playerId, true)

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
   const requiredParams = ['itemId', 'answer']
   utils.validateBodyParamProps(body, requiredParams)

   const playerItem = await playerStore.getPlayerItem(req.payload.gameId, req.payload.playerId)
   const questionItem = await itemStore.getItem(req.payload.gameId, parseInt(body.itemId))

   if(questionItem.message){
      playerItem.readyStatus = true
      await playerStore.writePlayerItem(playerItem)
      return res.json({good: 'Y'})
   }

   let playerQuestion = {
      question: questionItem.question,
      playerAnswer: body.answer.toLowerCase(),
      correctAnswer: questionItem.correctAnswer,
      correct: false
   }

   if(playerQuestion.playerAnswer === questionItem.correctAnswer.toLowerCase()){
      playerItem.totalScore += questionItem.scoreValue
      playerQuestion.correct = true
   }

   playerItem.readyStatus = true

   playerItem.questions.push(playerQuestion)

   await playerStore.writePlayerItem(playerItem)

   res.json({good: 'Y'}) // Return 'nextItem' url??


}


module.exports.quit = async (req, res, next) => {

   // Allow players to quit from web app during game 
   // Set player status for game to continue
   // Stop user session updates
}