

const Components = {

   loginForm: () => {
      return `
         <div>
            <div class="mb-3">
               <label for="exampleInputEmail1" class="form-label">Email address</label>
               <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
               <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div class="mb-3">
               <label for="exampleInputPassword1" class="form-label">Password</label>
               <input type="password" class="form-control" id="exampleInputPassword1">
            </div>
            <div class="mb-3 form-check">
               <input type="checkbox" class="form-check-input" id="exampleCheck1">
               <label class="form-check-label" for="exampleCheck1">Check me out</label>
            </div>
            <button type="submit" class="btn btn-primary" onclick="groupSubmit()">Submit</button>
         </div>   
      `
   },


   gameList: (games) => {
      var div = `<div> <ul class="list-group">`
      for(let game of games){
         div += `<li class="list-group-item">${game.quizName} <button id="${game.quizName}" class="btn btn-primary butt">Choose</button></li>`
      }
      div += `</ul> </div>`

      return div
   },

   playerList: (players) => {
      var div = `<div> <ul class="list-group">`
      for(let player of players){
         div += `<li class="list-group-item">${player.playerName} <button id="${player.playerId}" class="btn btn-primary playerbtn">Select</button></li>`
      }
      div += `</ul> </div>`

      return div
   }
}