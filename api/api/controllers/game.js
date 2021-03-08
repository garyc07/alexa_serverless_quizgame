

const {gameStore, itemStore, playerStore} = require('../services/dynamo/index')
const utils = require('../utils')
const remoteInterface = require('../services/remote/interface')
const gameTypes = require('../services/localData/gameTypes')
const difficulties = require('../services/localData/difficulty').options
const generator = require('../services/generator')
const APIError = require('../services/errors/APIError')



function validateParams(body){

   const requiredParams = ['groupId', 'difficulty', 'players', 'gameType']
   utils.validateBodyParamProps(body, requiredParams)


   const gameTypeOptions = Object.keys(gameTypes)

   // Alter original body request to ensure all lower case characters
   body.gameType = body.gameType.toLowerCase()
   if(!gameTypeOptions.includes(body.gameType)){
      throw new APIError(422, body.gameType + ' is not an available game type option')
   }

   body.difficulty = body.difficulty.toLowerCase()
   if(!difficulties.includes(body.difficulty)){
      throw new APIError(422, body.difficulty + ' is not an available game difficulty choice')
   }


   if(!Array.isArray(body.players)){
      throw new APIError(422, 'Expected a list of names (strings) as players property')
   } else {
      if(body.players.length < 1){
         throw new APIError(422, 'player list cannot be empty')
      }
      for(let player of body.players){
         if(typeof player !== 'string'){
            throw new APIError(422, 'Expected only string values in players list')
         }
      }
   }

}



module.exports.types = async (req, res, next) => {

   let types = []
   for(let type in gameTypes){
      types.push({
         name: type,
         description: gameTypes[type].description
      })
   }

   res.json({types: types})
}


module.exports.difficulties = async (req, res, next) => {
   res.json({options: difficulties})
}



module.exports.setup = async (req, res, next) => {


   const body = req.body
   const gameId = generator.generateId()
   const quizName = generator.generateQuizName() // User friendly name for web app selection


   validateParams(body)


   const gamePlayers = body.players.map(player => {
      return {
         gameId: gameId,
         playerId: generator.generateId(),
         playerName: player,
         lastItemId: 0,
         totalScore: 0,
         questions: []
      }
   })


   let gameItem = {
      groupId: body.groupId,
      gameId: gameId,
      quizName: quizName,
      difficulty: body.difficulty,
      players: gamePlayers.map(player => player.playerId)
   }


   // Get the game items(questions) based on setup input
   const items = await remoteInterface.gameItemsBuilder(gameId, body.gameType, body.difficulty)


   // Write this Game Item
   await gameStore.createNewGame(gameItem)

   // Write player session items for this game
   for(const player of gamePlayers){
      await playerStore.writePlayerItem(player)
   }

   // Write questions items for this game
   for(const item of items){

      // Set the initial message item as ready from the start
      if(item.itemId == 1){
         item.readyStatus = true
      }
      await itemStore.writeItem(item)
   }


   const token = utils.generateToken(body.groupId, gameId, null)

   res.status(201).json({
      quizName: quizName,
      token: token
   })

}




module.exports.groupGames = async (req, res, next) => {


   const allGroupGames = await gameStore.getGroupGames(req.query.groupId)
   if(allGroupGames.length < 1){
      return res.sendStatus(404)
   }

   const games = allGroupGames.map((game) => {
      return {
         gameId: game.gameId, 
         quizName: game.quizName
      }
   })

   res.json({games: games})

   
}

module.exports.deleteOpenGroupGame = async (req, res, next) => {

   // Option from UI when listing current group games
   // To delete open games for this group that are old. // Add date to game item   
}



