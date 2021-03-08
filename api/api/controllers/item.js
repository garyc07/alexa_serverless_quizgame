const { itemStore } = require('../services/dynamo/index')

function combineAndRandomise(arr, val){
   if(!arr) return undefined
   arr.push(val)
   return arr.sort(() => Math.random() - 0.5)
}


module.exports.nextItem = async (req, res, next) => {

   try{

      let nextItemId = 1
      if(req.query.lastItemId){
         nextItemId = parseInt(req.query.lastItemId) + 1
      }

      const nextItem = await itemStore.getItem(req.payload.gameId, nextItemId)

      if(nextItem.readyStatus){
         return res.json({item: {
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
      } else {
         return res.json({not_ready: 'Y'})
      }

   } catch(err){
      next(err)
   }

}