// import Vue from 'vue'
// import io from 'socket.io-client'
// // import ss from 'socket.io-stream'
// import VueSocketIOExt from 'vue-socket.io-extended'

// const socket = io('http://localhost:4000', {
//   autoConnect: false
// })

// export default ({ store }) => {
//   Vue.use(VueSocketIOExt, socket, { store })
// }

import io from 'socket.io-client'
import ss from 'socket.io-stream'
const socket = null
const socketStream = null

export default {
  io,
  ss,
  socket,
  socketStream
}
