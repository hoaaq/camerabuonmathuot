import _ from 'lodash'
import { encode } from 'base64-arraybuffer'

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
      await this.$axios.$get('live/play', {
        params: {
          id: cam.id,
          link: cam.link
        }
      })
      this.canvas[cam.id] = document.getElementById('canvas' + cam.id)
      this.ctx[cam.id] = this.canvas[cam.id].getContext('2d', { alpha: false })
      this.image[cam.id] = new Image()
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
    }, 500),

    async handleRemove(item) {
      await this.$store.dispatch('live/removecam', item)
    }
  },
  mounted() {
    this.$socket.$subscribe('data', (data) => {
      const canvas = this.canvas[data.id]
      const image = this.image[data.id]
      const ctx = this.ctx[data.id]
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
      image.src = 'data:image/png;base64, ' + encode(data.buffer)
    })
  }
}
