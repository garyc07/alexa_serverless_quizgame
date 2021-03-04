const {itemStore, playerStore} = require('../services/dynamo/index')

function combineAndRandomise(arr, val){
   if(!arr) return undefined
   arr.push(val)
   return arr.sort(() => Math.random() - 0.5)
}


module.exports.nextItem = async (req, res, next) => {

   try{

      const players = await playerStore.getAllForGame(req.payload.gameId)
      for(const p of players){
         if(!p.readyStatus){
            return res.json({not_ready: 'Y'})
         }
      }

      let nextItemId = 1
      if(req.query.lastItemId){
         nextItemId = parseInt(req.query.lastItemId) + 1
      }

      const nextItem = await itemStore.getItem(req.payload.gameId, nextItemId)


      // Set all players as readyStatus false // TODO Should be done in some sort of transactional method
/*       for(const p of players){
         await playerStore.setPlayerReadyStatus(req.payload.gameId, p.playerId, false)
      } */

      if(req.payload.playerId){
         await playerStore.setPlayerReadyStatus(req.payload.gameId, req.payload.playerId, false)
      }

      res.json({item: {
         itemId: nextItemId,
         message: nextItem.message,
         question: nextItem.question,
         answers: combineAndRandomise(nextItem.incorrectAnswers, nextItem.correctAnswer),
         questionType: nextItem.questionType,
         scoreValue: nextItem.scoreValue,
         timerSeconds: nextItem.timerSeconds,
         roundNumber: nextItem.roundNumber,
         questionNumber: nextItem.questionNumber
      }})

   } catch(err){
      next(err)
   }

}