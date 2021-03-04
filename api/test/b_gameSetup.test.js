const fs = require('fs')
const jsonwebtoken = require("jsonwebtoken")
var supertest = require('supertest')


const request = supertest('http://localhost:3000/dev/')


let gameDetail = {
   groupId: '3',
   difficulty: 'easy',
   players: ['Gary'],
   gameType: 'standard'
}


describe("Game Setup", () => {

   test('Create game failure, Invalid params', async done => {
      await request.post('game/setup')
         .send({
            groupId: '3',
            difficulty: 'easy',
            players: ['Gary']
         })
         .expect(422)
         .then(res => {
            done()
         })
   })

   it('Create new game', async done => {
      return request.post('game/setup')
         .send(gameDetail)
         .expect(201)
         .then(res => {
            expect(res.body).toBeDefined()
            expect(res.body.quizName).toBeDefined()
            expect(res.body.token).toBeDefined()

            const jsonData = JSON.stringify({
               quizName: res.body.quizName,
               gameId: jsonwebtoken.decode(res.body.token).gameId,
               token: res.body.token
            })

            fs.writeFile('test/data.json', jsonData, 'utf8', (err) => {
               if(err){
                  return console.log(err)
               }
               done()
            })
         })
   })
})