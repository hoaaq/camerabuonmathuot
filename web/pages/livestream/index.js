import _ from 'lodash'
// import { encode } from 'base64-arraybuffer'
import soc from '~/plugins/socket.io.js'

export default {
  async middleware({ store }) {
    await store.dispatch('live/getcams', { input: null })
  },
  data() {
    return {
      drawer: false,
      searchString: null,
      searchOverlay: false,
      canvas: {},
      ctx: {},
      image: {}
    }
  },
  computed: {
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
    async handlePlay(cam) {
      this.canvas[cam.id] = document.getElementById('canvas' + cam.id)
      this.ctx[cam.id] = this.canvas[cam.id].getContext('2d', { alpha: false })
      this.image[cam.id] = new Image()
      await this.$axios.$get('live/play', {
        params: {
          id: cam.id
        }
      })
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
    // soc.socketStream.on('livestream', function(stream, data) {
    //   const id = data.id
    //   stream.on('data', function(data) {
    //     tmp += 1
    //     console.log(tmp)
    //     const canvas = document.getElementById('canvas' + id)
    //     const ctx = canvas.getContext('2d')
    //     const image = new Image()
    //     image.onload = function() {
    //       ctx.drawImage(
    //         image,
    //         0,
    //         0,
    //         image.width,
    //         image.height,
    //         0,
    //         0,
    //         canvas.width,
    //         canvas.height
    //       )
    //     }
    //     image.src = 'data:image/jpg;base64, ' + data
    //   })
    // })
    soc.socket.on('livestream', function(data) {
      const canvas = document.getElementById('canvas' + data.id)
      const ctx = canvas.getContext('2d')
      const image = new Image()
      image.onload = function() {
        ctx.drawImage(
          image,
          0,
          0,
          image.width,
          image.height,
          0,
          0,
          canvas.width,
          canvas.height
        )
      }
      image.src = 'data:image/jpg;base64, ' + data.buffer
    })
    soc.socket.on('letbeat', function() {
      soc.socket.emit('clientbeat')
      setInterval(() => {
        soc.socket.emit('clientbeat')
      }, 4500)
    })
  }
}
