import React, { useState, useEffect } from 'react'
import config from '../../config'

const EventOrder = () => {
   const [messages, setMessages] = useState('')

   useEffect(() => {
      const eventSource = new EventSource(`${config.serverUrl}/event/order`)

      eventSource.onopen = () => {
         // console.log('Connection to server opened')
      }

      eventSource.onerror = (error) => {
         // console.error('EventSource error:', error)
      }

      eventSource.addEventListener('new_order', (event) => {
         const newMessage = JSON.parse(event.data)
         setMessages(newMessage)
      })

      return () => {
         eventSource.close()
      }
   }, [])

   return messages
}

export default EventOrder
