import _ from 'lodash'

export default {
  async middleware({ store }) {
    await store.dispatch('playback/getcams', { input: null })
  },
  components: {
    // Viewcam,
    Selection
  },
  data() {
    return {
      pickedHour: '00',
      pickedMin: '00',
      pickedSec: '00',
      date: null,
      time: null,
      selectedCam: null,
      searchOverlay: false,
      searchString: null,
      loadCam: false,
      endTime: null
    }
  },
  computed: {
    listCam() {
      this.getListCam()
      return this.$store.state.playback.listcam
    },
    hour() {
      const h = []
      for (let i = 0; i < 24; i++) {
        h.push(i)
      }
      return h
    },
    min() {
      const m = []
      for (let i = 0; i < 60; i++) {
        m.push(i)
      }
      return m
    },
    second() {
      const s = []
      for (let i = 0; i < 60; i++) {
        s.push(i)
      }
      return s
    }
  },
  mounted() {
    this.$root.$on('timeQuery', (time) => {
      this.time = time
      this.queryString()
    })

    this.$nextTick(() => {
      const canvas = document.querySelector('canvas')
      const ctx = canvas.getContext('2d')
      ctx.scale(2, 2)
      canvas.height *= 2
      canvas.width *= 2

      const camFromMap = this.$store.state.map.selectedcam || null
      this.clear()

      if (camFromMap) {
        this.selectCam(camFromMap.input)
      }
    })

    let today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
    const yyyy = today.getFullYear()

    today = `${yyyy}_${mm}_${dd}`

    this.date = today
    this.timeQuery()
  },
  methods: {
    selectHour(h) {
      this.pickedHour = h < 10 ? '0' + h : '' + h
      this.timeQuery()
    },
    selectMin(m) {
      this.pickedMin = m < 10 ? '0' + m : '' + m
      this.timeQuery()
    },
    selectSec(s) {
      this.pickedSec = parseInt(s) < 10 ? '0' + s.toString() : '' + s.toString()
      this.timeQuery()
    },
    timeQuery() {
      this.time = `${this.pickedHour}_${this.pickedMin}_${this.pickedSec}`
      this.endTime = `${this.pickedHour}_${this.pickedMin}_${parseInt(
        this.pickedSec
      ) + 10}`
    },
    async getListCam() {
      if (!this.loadCam) {
        this.loadCam = !this.loadCam
        await this.$store.dispatch('playback/getcams', { input: null })
      }
    },
    async handleSelectcam(item) {
      // await this.$store.dispatch('playback/selectcam', item)
    },
    async sayt() {
      this.searchOverlay = true
      await this.$store.dispatch('playback/getcams', {
        input: this.searchString
      })
      this.searchOverlay = false
    },
    throttlesearch: _.throttle(function(e) {
      this.sayt()
    }, 500),
    debouncesearch: _.debounce(function(e) {
      this.sayt()
    }, 500),
    async clear() {
      await this.$store.dispatch('map/clearCam', {
        input: null
      })
    },
    datetime(event) {
      this.date = event
    },
    selectCam(item) {
      this.selectedCam = JSON.stringify(item)
      this.handlePlayCam()
      // const canvas = document.querySelector('canvas')
      // const ctx = canvas.getContext('2d')
      //
      // ctx.clearRect(0, 0, canvas.width, canvas.height)
      // ctx.font = '30px Arial'
      // ctx.fillText(this.selectedCam, 10, 50)
    },
    async handlePlayCam() {
      // console.log(this.selectedCam)

      if (this.selectedCam != null) {
        const ws = await this.$axios.$get('playback/play', {
          params: {
            id: JSON.parse(this.selectedCam).id,
            start_time: `${this.date}_${this.time}`,
            end_time: `${this.date}_${this.endTime}`
          }
        })

        await console.log(ws)
      }
    }
  }
}
