import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [messages, setMessages] = useState([])
  const [value, setValue] = useState("")

  //метод отправки сообщения через библиотеку axios
  const sendMessage = async () => {
    await axios.post('http://localhost:5000/new-messages', {
      message: value,
      id: Date.now()
    })
  }

  //получение сообщений
  useEffect(() => {
    subscribe() //в js компилятор не обязан ждать await для асинхронной функции, можно итак, функция выполнится корректно
    //внутри нее все равно нету колбэков к основному потоку.
  }, [])

  //делаем рекурсивно, чтобы функция вызывала сама себя и подписывалась на отдачу следующего сообщения
  //если не подписаться, то пользователь не получит следующее сообщение
  const subscribe = async () => {
    try{
      const {data} = await axios.get('http://localhost:5000/get-messages')
      setMessages(prev => [data, ...prev]) //добавляем новые сообщения в конец
      await subscribe()
    }
    catch(ex)
    {
      setTimeout(() => {
        subscribe()
      }, 500)
      console.log(ex)
    }
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
            {mess.message}
          </div>)}
        </div>
      </div>
    </div>
  )
}

export default App
