const express = require('express')
const cors = require("cors")
const events = require("events")
const PORT = 5000

//способ управления событиями в node.js
const emitter = new events.EventEmitter()
//объект emitter нужен чтобы создавать события и вызывать их

const app = express()

app.use(cors())
app.use(express.json()) //middleware, который говорит Express:
//«Если клиент прислал JSON в теле HTTP-запроса - распарсь его и положи результат в req.body».

//req (request) - содержит все, что клиент отправил серверу (заголовки, тело, query параметры и прочее)
//res (response) - объект через который идет ответ клиенту

//для работы event sourcing уже нужно указывать заголовки
app.get('/connect', (req, res) => {
    res.writeHead(200, {
        'Connection': 'keep alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache'
    })
    emitter.on('newMessage', (message) => {
        // здесь проблема отправки сообщения в том, что мы пытаемся передать объект, но объект передавать в event source нельзя
        // также есть определенный синтаксис отправки, некий регламент, как нужно резолвить сообщения при event sourcing
        res.write(`data: ${JSON.stringify(message)} \n\n`)
    })
})

app.post('/new-messages', (req, res) => {
    const message = req.body
    emitter.emit('newMessage', message)
    res.status(200)
})

app.listen(PORT, () => console.log(`server started on port ${PORT}`))