import { useEffect, useState, useRef } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [messages, setMessages] = useState([])
  const [value, setValue] = useState("")
  //состояния подключения
  const [connected, setConnected] = useState(false)
  const [userName, setUserName] = useState("")
  
  //подключаем веб сокет клиента
  const socket = useRef()

  function connect () {
    socket.current = new WebSocket('ws://localhost:5000')

    //вешаем слушателей
    socket.current.onopen = () => {
      setConnected(true)
      const message = {
        event: 'connection',
        userName,
        id: Date.now()
      }
      socket.current.send(JSON.stringify(message))
      console.log("connection accepted")
    }

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data)
      setMessages(prev => [message, ...prev])
    }

    socket.current.onclose = () => {
      console.log("connection is closed")
    }

    socket.current.onerror = () => {
      console.log("socket error")
    }
  }

  //метод отправки сообщения через библиотеку axios
  const sendMessage = async () => {
    const message = {
      userName,
      message: value,
      id: Date.now(),
      event: 'message'
    }
    socket.current.send(JSON.stringify(message))
    setValue('')
  }

  //проверка было ли подключение
  if(!connected)
  {
    return (
      <div className="center">
        <div className="form">
          <input type="text" placeholder="Введите ваше имя" value={userName} onChange={(e) => setUserName(e.target.value)}/>
          <button onClick={connect}>Войти</button>
        </div>
      </div>
    )
  }

  return (
    <div className="main-container">
      <div>
        <div className="form">
          <input type="text" value={value} onChange={(e) => setValue(e.target.value)}/>
          <button onClick={sendMessage}>Отправить</button>
        </div>
        <div className="messages">
          {messages.map((mess, index) => 
          <div className='message' key={index}>
            {mess.event === 'connection' ? <div>Пользователь {mess.userName} подключился</div> : <div>{mess.userName}. {mess.message}</div>}
          </div>)}
        </div>
      </div>
    </div>
  )
}

export default App