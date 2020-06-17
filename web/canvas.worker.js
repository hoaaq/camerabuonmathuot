self.addEventListener('message', ({ data }) => {
  const wsConsume = new WebSocket(data.ws)
  wsConsume.onmessage = function(r) {
    const message = r.data
    const receiveMsg = JSON.parse(message)
    const ackMsg = { messageId: receiveMsg.messageId }
    wsConsume.send(JSON.stringify(ackMsg))
    self.postMessage(receiveMsg.payload)
  }
})
