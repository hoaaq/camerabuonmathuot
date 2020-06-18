<template>
  <client-only>
    <v-layout id="map-wrap" style="height: 100vh">
      <v-layout style="position: absolute; top: 0; right: 0; z-index: 1000">
        <v-container fluid>
          <v-btn small light fab @click="drawer = !drawer">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-container>
        <v-navigation-drawer
          v-model="drawer"
          class="pa-3"
          right
          fixed
          width="40%"
        >
          <v-btn small light fab @click="drawer = !drawer">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <div v-for="(cam, i) in camSelect" :key="cam" class="mt-5">
            {{ cam }}
            <br />
            Status:
            <span v-if="camStatus === 'Online' && cam.id !== 6">
              <v-icon size="25" :color="statusIconOnline.color">
                {{ statusIconOnline.icon }}
              </v-icon>
              {{ camStatus }}
            </span>
            <span v-else>
              <v-icon size="25" :color="statusIconOffline.color">
                {{ statusIconOffline.icon }}
              </v-icon>
              {{ camStatus }}
            </span>
            <v-hover v-if="cam == null"></v-hover>
            <v-hover v-else class="mt-3">
              <template>
                <div
                  class="d-flex flex-column align-center"
                  style="position: relative; height: 375px"
                >
                  <canvas
                    :id="'canvas' + cam.id"
                    class="liveviewcanvas"
                  ></canvas>
                  <div class="liveviewinfo">
                    <span>{{ cam.code }}</span>
                  </div>
                  <v-fade-transition>
                    <v-overlay absolute>
                      <v-btn icon color="info"
                        ><v-icon size="35">mdi-play</v-icon></v-btn
                      >
                      <v-btn icon color="white" @click="openPlayBack(cam)"
                        ><v-icon>mdi-film</v-icon></v-btn
                      >
                      <v-btn icon size="50" color="error" @click="removeCam(i)"
                        ><v-icon>mdi-close</v-icon></v-btn
                      >
                    </v-overlay>
                  </v-fade-transition>
                </div>
              </template>
            </v-hover>
          </div>
        </v-navigation-drawer>
      </v-layout>
      <l-map :zoom="15" :center="[10.7377, 106.7188]">
        <l-tile-layer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        ></l-tile-layer>
        <l-layer-group v-for="(l, idx) in latLong" :key="l">
          <l-marker
            v-if="idxSelect.includes(idx) && idxSelect.length !== 0"
            :lat-lng="l"
            @click="selectCam(idx)"
          >
            <l-icon :icon-size="iConSize" :icon-url="camURL.select"> </l-icon>
          </l-marker>
          <l-marker v-else-if="idx !== 5" :lat-lng="l" @click="selectCam(idx)">
            <l-icon :icon-size="iConSize" :icon-url="camURL.online"> </l-icon>
          </l-marker>
          <l-marker v-else :lat-lng="l" @click="selectCam(idx)">
            <l-icon :icon-size="iConSize" :icon-url="camURL.offline"> </l-icon>
          </l-marker>
        </l-layer-group>
      </l-map>
    </v-layout>
  </client-only>
</template>

<script>
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
      camStatus: null,
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
      console.log(this.listCam)
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

      if (this.camSelect.length === 5) {
        alert('Max select is 5')
      } else {
        this.drawer = true
        this.camSelect.push(this.listcam[idx])
        this.idxSelect.push(idx)
        this.camStatus = 'Online'
      }
    },
    async openPlayBack(item) {
      // alert(idCam)
      // console.log(this.$route)
      await this.$store.dispatch('map/selectcam', {
        input: JSON.stringify(item)
      })
      return this.$router.push('/playback')
    }
  }
}
</script>
