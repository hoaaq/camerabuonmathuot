<template>
  <div style="height: 100vh">
    <v-layout
      v-if="!drawer"
      style="position: absolute; top: 0; right: 0; z-index: 1000"
    >
      <v-container fluid>
        <v-btn small light fab @click="drawer = !drawer">
          <v-icon>mdi-map-marker-radius</v-icon>
        </v-btn>
      </v-container>
    </v-layout>
    <div id="map" style="height: 100%; width: 100%;"></div>

    <v-navigation-drawer
      v-model="drawer"
      class="pa-3"
      app
      right
      fixed
      width="30%"
      style="z-index: 9999;"
    >
      <v-btn small light fab @click="drawer = !drawer">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-card-title>Thay đổi vị trí camera</v-card-title>
      <div class="ml-2 mb-0 pb-0">
        <v-text-field label="Tìm kiếm" @input="1 + 1"></v-text-field>
      </div>
      <v-overlay :value="searchOverlay" absolute>
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-overlay>
      <v-switch
        class="ml-5"
        :label="`Lọc cam đã có vị trí: ${filIsNotSet ? 'Bat' : 'Tat'}`"
        @change="filIsNotSet = !filIsNotSet"
      ></v-switch>
      <v-list two-line style="height: 327px" class="overflow-y-auto">
        <v-list-item
          v-for="(item, i) in listCam"
          :key="i"
          @click="pickedLocation(item)"
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.fulltext }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
// import L from '~/plugins/leaflet.js'
export default {
  data() {
    return {
      drawer: true,
      filIsNotSet: false,
      searchOverlay: false,
      draggable: true,
      latlongdata: [
        [10.7383, 106.7216],
        [10.7333, 106.7206],
        [10.7333, 106.7246],
        [10.7381, 106.7302],
        [10.7385, 106.7132],
        [10.7485, 106.734],
        [10.7275, 106.703],
        [10.7275, 106.703]
      ],
      listCam: [
        { id: 1, name: 'Cam1', fulltext: 'chua chon' },
        { id: 2, name: 'Cam1', fulltext: 'chua chon' },
        { id: 3, name: 'Cam1', fulltext: 'chua chon' },
        { id: 4, name: 'Cam1', fulltext: 'chua chon' }
      ],
      map: {},
      listCamMarker: [],
      isPickingLocation: false,
      pickingMarker: {
        marker: {},
        latlon: {},
        address: ''
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.map = this.$L.map('map', {}).setView([10.7377, 106.7188], 15)
      this.$L
        .tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {})
        .addTo(this.map)
      this.map.addEventListener('click', this.addLocation)
    })
  },
  methods: {
    addLocation(ev) {
      if (this.isPickingLocation || !this.drawer) return

      this.pickingMarker.marker = this.$L.marker(
        [ev.latlng.lat, ev.latlng.lng],
        {
          draggable: 'true'
        }
      )
      this.pickingMarker.latlon = [ev.latlng.lat, ev.latlng.lng]
      this.pickingMarker.marker.addTo(this.map)
      this.isPickingLocation = true
    },
    pickedLocation(cam) {
      if (!this.isPickingLocation) return

      const idxCam = this.listCam.indexOf(cam)

      const camIcon = this.$L.icon({
        iconUrl: require('~/static/cam-icon.png'),
        iconSize: [40, 40]
      })

      if (this.listCamMarker[idxCam])
        this.map.removeLayer(this.listCamMarker[idxCam])

      this.listCamMarker[idxCam] = this.$L.marker(this.pickingMarker.latlon, {
        icon: camIcon
      })

      this.map.removeLayer(this.pickingMarker.marker)
      this.isPickingLocation = false

      this.listCamMarker[idxCam].addTo(this.map)

      cam.fulltext = this.pickingMarker.latlon
    }
  }
}
</script>
