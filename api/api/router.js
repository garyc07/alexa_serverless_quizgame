const express = require('express');
const router = new express.Router();

const {game, item, player} = require('./controllers/index')

const auth = require('./services/auth')


function asyncWrap(fn) {
   return async function wrappedFn(req, res, next) {
      try {
         await fn(req, res, next);
      } catch (err) {
         next(err)
      }
   }
}

router.route('/game/grouped?')
  .get(auth.optional, asyncWrap(game.groupGames))

router.route('/game/types')
  .get(auth.optional, asyncWrap(game.types))

router.route('/game/difficulties')
  .get(auth.optional, asyncWrap(game.difficulties))

router.route('/game/setup')
  .post(auth.optional, asyncWrap(game.setup))



router.route('/player/list?')
  .get(auth.optional, asyncWrap(player.list))

router.route('/player/edit')
  .post(auth.optional, asyncWrap(player.editName))

router.route('/player/submit')
  .post(auth.required, asyncWrap(player.submit))

router.route('/player/select')
  .post(auth.optional, asyncWrap(player.select))



router.route('/item/next?')
  .get(auth.required, asyncWrap(item.nextItem))



  
module.exports = router;