
function swapTemplate(content){
   var rootEl = $('#root')
   rootEl.empty()
   rootEl.append(content)
}

const Templates = {

   gameList: (res) => {
      var div = `<div> <ul class="list-group">`
      for(let game of res.games){
         div += `<li class="list-group-item">${game.quizName} <button id="${game.gameId}" class="btn btn-primary gamebtn">Choose</button></li>`
      }
      div += `</ul> </div>`

      swapTemplate(div)
   },

   playerList: (res) => {
      var div = `<div> <ul class="list-group">`
      for(let player of res.players){
         div += `<li class="list-group-item">${player.playerName} 
                     <button id="${player.playerId}-edit" class="btn btn-primary playereditbtn">Edit Name</button>
                     <button id="${player.playerId}" class="btn btn-primary playerbtn">Select</button>
                  </li>`
      }
      div += `</ul> </div>`

      swapTemplate(div)
   },


   nextItem: (res) => {
      if(res.not_ready){
         // Render waiting page
         // Set timer to call again
      } else {
         localStorage.setItem('lastItemId', res.item.itemId)
         var div = `<div id="itemDiv">`
         if(res.item.message){
            div += `<p>${res.item.message}</p>`
            div += `<button class="btn btn-primary playersubmitbtn">Ready</button>`
         } else {
            div += `<p>${res.item.question}</p>`

            var ansNum = 0
            for(let answer of res.item.answers){
               ansId = 'answer_' + ansNum++;
               div += `
                  <div class="form-check">
                     <input class="form-check-input" type="radio" id="${ansId}" value="${answer}">
                     <label class="form-check-label" for="${ansId}">
                        ${answer}
                     </label>
                  </div>
               `
            }


            div += `<button class="btn btn-primary playersubmitbtn">Submit</button>`
         }

         div += `</div>`

         swapTemplate(div)
      }
   }
}