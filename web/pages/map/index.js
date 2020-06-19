// import L from '~/plugins/leaflet.js'
// import { redirect } from '@nuxtjs/auth/lib/module/defaults'

export default {
  async middleware({ store }) {
    await store.dispatch('playback/getcams', { input: null })
  },
  data() {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 13,
      center: [47.41322, -1.219482],
      iConSize: [45, 45],
      camURL: {
        online: require('@/static/active.png'),
        offline: require('@/static/offline.png'),
        select: require('@/static/select.png')
      },
      drawer: false,
      items: [
        { title: 'Home', icon: 'mdi-home-city' },
        { title: 'My Account', icon: 'mdi-account' },
        { title: 'Users', icon: 'mdi-account-group-outline' }
      ],
      latLong: [
        [10.7383, 106.7216],
        [10.7333, 106.7206],
        [10.7333, 106.7246],
        [10.7381, 106.7302],
        [10.7385, 106.7132],
        [10.7485, 106.734],
        [10.7275, 106.703]
      ],
      loadCam: false,
      camSelect: [],
      idxSelect: [],
      camStatus: [
        'Online',
        'Offline',
        'Online',
        'Online',
        'Online',
        'Offline',
        'Offline'
      ],
      statusIconOnline: {
        icon: 'mdi-checkbox-marked-circle',
        color: 'success'
      },
      statusIconOffline: {
        icon: ' mdi-video-off',
        color: 'deep-orange accent-3'
      }
    }
  },
  computed: {
    icon() {
      return this.$L.icon({
        iconUrl: '/images/baseball-marker.png',
        iconSize: [32, 32],
        iconAnchor: [16, 37]
      })
    },
    listcam() {
      this.getListCam()
      return this.$store.state.playback.listcam
    }
  },
  mounted() {
    // this will run after webpage rendered
    this.$nextTick(() => {
      // console.log('done!')
      // const map = this.$L.map('map', {}).setView([10.7377, 106.7188], 15)
      // // //
      // this.$L
      //   .tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {})
      //   .addTo(map)
      //
      // const camIcon = this.$L.icon({
      //   iconUrl: require('~/static/off.png'),
      //   iconSize: [40, 40]
      // })
      //
      // this.latlongdata.forEach((p) => {
      //   this.listCam.push(
      //     this.$L.marker(p, {
      //       icon: camIcon
      //     })
      //   )
      // })
      //
      // // const content =
      // this.listCam.forEach((p) => {
      //   p.addTo(map)
      //   p.on('click', function() {
      //     // alert('a')
      //     console.log(this)
      //   })
      // })
    })
  },
  methods: {
    async getListCam() {
      if (!this.loadCam) {
        this.loadCam = !this.loadCam
        await this.$store.dispatch('map/getcams', { input: null })
      }
    },
    removeCam(cam) {
      const idxRemove = this.camSelect.indexOf(cam)
      this.camSelect.splice(idxRemove, 1)
      this.idxSelect.splice(idxRemove, 1)
      console.log(this.camSelect)
      this.drawer = this.camSelect.length !== 0
    },
    selectCam(idx) {
      const idxRemove = this.camSelect.indexOf(this.listcam[idx])

      if (idxRemove > -1) {
        this.camSelect.splice(idxRemove, 1)
        this.idxSelect.splice(idxRemove, 1)
        console.log(this.camSelect)
        this.drawer = this.camSelect.length !== 0

        return
      }

      if (this.camSelect.length > 2) {
        alert('Max select is 3')
      } else {
        this.drawer = true
        this.camSelect.push(this.listcam[idx])
        this.idxSelect.push(idx)
      }
    },
    async handlePlayCam(cam) {
      const ws = await this.$axios.$get('map/play', {
        params: {
          id: cam.id
        }
      })

      console.log(ws)
    },
    async openPlayBack(item) {
      await this.$store.dispatch('map/selectcam', {
        input: JSON.stringify(item)
      })
      return this.$router.push('/playback')
    }
  }
}
