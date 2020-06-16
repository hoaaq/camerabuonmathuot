import _ from 'lodash'
// import { decode } from 'base64-arraybuffer'
import soc from '~/plugins/socket.io.js'

export default {
  async middleware({ store }) {
    await store.dispatch('live/getcams', { input: null })
  },
  data() {
    return {
      windowsinrow: 5,
      drawer: false,
      searchString: null,
      searchOverlay: false,
      canvas: {},
      ctx: {},
      image: {},
      ws: {},
      test: {
        queue: []
      }
    }
  },
  computed: {
    windowwidth() {
      return 100 / this.windowsinrow
    },
    listcam() {
      const lscam = this.$store.state.live.listcam
      const sls = this.selectedcam.map((item) => {
        return item.id
      })
      return lscam.filter((item) => {
        if (!sls.includes(item.id)) return item
      })
    },
    selectedcam: {
      get() {
        return this.$store.state.live.selectedcam
      },
      async set(value) {
        await this.$store.dispatch('live/sortselect', value)
      }
    }
  },
  methods: {
    async handleSelectcam(item) {
      await this.$store.dispatch('live/selectcam', item)
    },
    async handleh264() {
      this.test.ms = new MediaSource()
      this.test.player = document.getElementById('canvash264')
      this.test.player.src = window.URL.createObjectURL(this.test.ms)
      const self = this
      this.test.ms.addEventListener(
        'sourceopen',
        function(e) {
          self.test.player.play()
          self.test.buffer = self.test.ms.addSourceBuffer(
            'video/mp4; codecs="avc1.42C028"'
          )
          self.test.buffer.mode = 'sequence'
          self.test.buffer.addEventListener('updatestart', function(e) {
            console.log('updatestart: ' + self.test.ms.readyState)
          })
          self.test.buffer.addEventListener('update', function(e) {
            console.log('update: ' + self.test.ms.readyState)
          })
          self.test.buffer.addEventListener('updateend', function(e) {
            console.log('updateend: ' + self.test.ms.readyState)
          })
          self.test.buffer.addEventListener('error', function(e) {
            console.log('error: ' + self.test.ms.readyState)
          })
          self.test.buffer.addEventListener('abort', function(e) {
            console.log('abort: ' + self.test.ms.readyState)
          })
          self.test.buffer.addEventListener('update', function() {
            // Note: Have tried 'updateend'
            if (self.test.queue.length > 0 && !self.test.buffer.updating) {
              self.test.buffer.appendBuffer(self.test.queue.shift())
            }
          })
        },
        false
      )
      await this.$axios.$get('live/testh264', {
        params: {
          id: 1
        }
      })
    },
    async handlePlay(cam) {
      const canvas = document.getElementById('canvas' + cam.id)
      const ctx = canvas.getContext('webgl', { alpha: false })
      const image = new Image()
      const ws = await this.$axios.$get('live/play', {
        params: {
          id: cam.id
        }
      })
      const wsConsume = new WebSocket(ws)
      // const socket = soc.io.connect(ws)
      wsConsume.onmessage = function(r) {
        const message = r.data
        const receiveMsg = JSON.parse(message)
        const ackMsg = { messageId: receiveMsg.messageId }
        wsConsume.send(JSON.stringify(ackMsg))
        image.onload = function() {
          canvas.width = this.naturalWidth
          canvas.height = this.naturalHeight
          ctx.drawImage(image, 0, 0)
        }
        image.src = 'data:image/jpg;base64, ' + receiveMsg.payload
      }
    },
    async handleStop(cam) {
      await this.$axios.$get('live/stop', {
        params: {
          id: cam.id
        }
      })
    },
    async handleRemove(cam) {
      await this.handleStop(cam)
      await this.$store.dispatch('live/removecam', cam)
    },
    async sayt() {
      this.searchOverlay = true
      await this.$store.dispatch('live/getcams', { input: this.searchString })
      this.searchOverlay = false
    },
    throttlesearch: _.throttle(function(e) {
      this.sayt()
    }, 500),
    debouncesearch: _.debounce(function(e) {
      this.sayt()
    }, 500)
  },
  mounted() {
    const self = this
    soc.socket.on('livestream', function(data) {
      console.log(self.test)
      if (self.test.buffer.updating || self.test.queue.length > 0) {
        self.test.queue.push(data.buffer)
      } else {
        self.test.buffer.appendBuffer(data.buffer)
      }
      // const canvas = self.canvas[data.id]
      // const ctx = self.ctx[data.id]
      // const image = self.image[data.id]
      // image.onload = function() {
      //   canvas.width = this.naturalWidth
      //   canvas.height = this.naturalHeight
      //   ctx.drawImage(image, 0, 0)
      // }
      // image.src = 'data:image/jpg;base64, ' + data.buffer
    })
    soc.socket.on('letbeat', function() {
      soc.socket.emit('clientbeat')
      setInterval(() => {
        soc.socket.emit('clientbeat')
      }, 4500)
    })
  }
}
