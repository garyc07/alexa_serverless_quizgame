/* var supertest = require('supertest')

const request = supertest('http://localhost:3000/dev/')
const data = require('./data.json')


describe('Quiz Items', () => {

   test('Get Next Item', async done => {
      await request.get(`item/next?lastItemId=1`)
         .set('Authorization', `Bearer ${data.token}`)
         .expect(200)
         .then(res => {
            console.log(res.body)
            done()
         })
   })
}) */