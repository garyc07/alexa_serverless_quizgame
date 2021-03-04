const express = require('express')
const bodyParser = require('body-parser')


const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({
   extended: true
}))

app.use(bodyParser.json())

app.use(express.static('public'))


app.post('/submit', (req, res) => {
   res.sendStatus(200)
})

app.get('/game/grouped?', (req, res) => {
   res.json({ games:[{gameId: 'rewrewrewr', quizName: 'QWERTY'}, {gameId: 'sdfsdfsdf', quizName: 'ASDF'}]})
})

app.get('/player/list', (req, res) => {
   res.json([{gameId: 'rewrewrewr', playerId: '1234', playerName: 'Marion'}, {gameId: 'rewrewrewr', playerId: '4321', playerName: 'Caroline'}])
})


app.listen(3003, () => console.log('Listening on port 3003!'))