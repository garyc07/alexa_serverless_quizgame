/* var supertest = require('supertest')

const request = supertest('http://localhost:3000/dev/')
const data = require('./data.json')


describe('Player Interactions', () => {

   let playerId = null

   describe('List All Players', () => {
      test('Get Player List', async done => {
         await request.get(`player/list?gameId=${data.gameId}`)
            .expect(200)
            .then(res => {
               expect(res.body).toBeDefined()
               expect(res.body.players).toBeDefined()
               expect(res.body.players).toHaveLength(1)
   
               playerId = res.body.players[0].playerId
               done()
            })
      })
   })


   describe('Edit PLayer Name', () => {
      test('Edit Player Name', async done => {
         await request.post('player/edit')
            .send({
               newName: 'Joe',
               gameId: data.gameId,
               playerId: playerId
            })
            .expect(200)
            .then(res => {
               expect(res.body).toBeDefined()

               done()
            })
      })
   })


   describe('Select Player', () => {
      test('Select Player', async done => {
         await request.post('player/select')
            .send({
               gameId: data.gameId,
               playerId: playerId
            })
            .expect(200)
            .then(res => {
               expect(res.body).toBeDefined()
               expect(res.body.token).toBeDefined()

               done()
            })
      })
   })


}) */