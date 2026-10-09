const express = require('express')
const cors = require("cors")
const events = require("events")
const PORT = 5000

//способ управления событиями в node.js
const emitter = new events.EventEmitter()
//объект emitter нужен чтобы оздавать события и вызывать их

const app = express()

app.use(cors())
app.use(express.json()) //middleware, который говорит Express:
//«Если клиент прислал JSON в теле HTTP-запроса - распарсь его и положи результат в req.body».

//req (request) - содержит все, что клиент отправил серверу (заголовки, тело, query параметры и прочее)
//res (response) - объект через который идет ответ клиенту

//1. пользователь делает get запрос на получение сообщения
//2. пользователь не получает сообщение сразу, т.к оно висит в long pooling
//3. emmiter.once - коллбэк на message, который сработает лишь раз, когда ему передастся message
//4. когда n-ный пользователь отправляет сообщение и оно доходит до сервера, то сообщение подписывается на событие emmiter.once()
//через emmiter.emit и провоцирует коллбэк передачей сообщения
//таким образом сообщение отправляется всем пользователям

app.get('/get-messages', (req, res) => {
    emitter.once('newMessage', (message) => { //once значит, что функция отработает лишь единожды
        res.json(message)
    }) //как только нам приходит сообщение, нам нужно уведомить всех остальных участников
})

app.post('/new-messages', (req, res) => {
    const message = req.body
    emitter.emit('newMessage', message)
    res.status(200)
})

app.listen(PORT, () => console.log(`server started on port ${PORT}`))