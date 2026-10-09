const ws = require('ws')

//создаем веб сокет сервер
const wss = new ws.Server({
    port: 5000
}, () => console.log('service started on port 5000'))

//начало работы с сокетом - подписываемся на событие с подключением
wss.on('connection', function connection(ws) {
    //за один connection передается один вебсокет - это какое-то одно конкретное подключение
    ws.on('message', function (message) {
        message = JSON.parse(message)
        switch (message.event) {
            case 'message':
                broadcastMessage(message)
                break
            case 'connection':
                broadcastMessage(message)
                break
        }
    })
    // ws.send('') //оправка сообщения
})

//широковещательный буфер, для отправки нескольким пользователям
function broadcastMessage(message) {
    //все клиенты у которых сейчас установлено подключение
    //пробегаемся по каждому итеративно и отдаем сообщение
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message))
    })
}