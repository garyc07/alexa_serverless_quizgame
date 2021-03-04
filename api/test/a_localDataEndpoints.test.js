var supertest = require('supertest')
const request = supertest('http://localhost:3000/dev/')

describe('Local Data Endpoints', () => {

   test('Get Available Game Types', async done => {
      await request.get('game/types')
         .expect(200)
         .then(res => {
            expect(res.body).toBeDefined()
            expect(res.body.types).toBeDefined()

            done()
         })
   })

   test('Get Available Game Difficulties', async done => {
      await request.get('game/difficulties')
         .expect(200)
         .then(res => {
            expect(res.body).toBeDefined()
            expect(res.body.options).toBeDefined()

            done()
         })
   })
})