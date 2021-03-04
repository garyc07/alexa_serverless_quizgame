

function groupSubmit(e){
   API.postTest({key: 'value'}, 'submit', (res) => {
      API.get('game/grouped?groupId=2', Templates.gameList)
   })
}


$(document).on('click', '.gamebtn', function(e) {
   var gameId = e.target.id
   localStorage.setItem('gameId', gameId)
   API.get('player/list?gameId=' + gameId, Templates.playerList)
})


$(document).on('click', '.playerbtn', function(e) {
   API.post({gameId: localStorage.getItem('gameId'), playerId: e.target.id}, 'player/select', (res) => {
      localStorage.setItem('token', res.token)
      API.getWithToken('item/next', res.token, Templates.nextItem)
   })
})


$(document).on('click', '.playersubmitbtn', function(e) {
   var token = localStorage.getItem('token')
   var lastItemId = localStorage.getItem('lastItemId')
   var answer = $('#itemDiv input:radio:checked').val()
   if(!answer){
      answer = 'None'
   }

   API.postWithToken({itemId: lastItemId, answer: answer}, 'player/submit', token, (res) => {
      API.getWithToken('item/next?lastItemId=' + lastItemId, token, Templates.nextItem)
   })
})
