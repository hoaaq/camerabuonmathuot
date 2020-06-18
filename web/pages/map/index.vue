<template>
  <client-only>
    <l-map>
      <div id="map" style="height: 100vh"></div>
    </l-map>
  </client-only>
</template>

<script>
// import L from '~/plugins/leaflet.js'
export default {
  data() {
    return {
      latlongdata: [
        [10.7383, 106.7216],
        [10.7333, 106.7206],
        [10.7333, 106.7246],
        [10.7381, 106.7302],
        [10.7385, 106.7132],
        [10.7485, 106.734],
        [10.7275, 106.703],
        [10.7275, 106.703]
      ]
    }
  },
  mounted() {
    // this will run after webpage rendered
    this.$nextTick(() => {
      // console.log('done!')
      const map = this.$L.map('map', {}).setView([10.7377, 106.7188], 15)
      // //
      this.$L
        .tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {})
        .addTo(map)

      const camIcon = this.$L.icon({
        iconUrl: require('~/static/cam-icon.png'),
        iconSize: [40, 40]
      })

      this.latlongdata.forEach((p) => {
        this.$L
          .marker(p, {
            icon: camIcon
          })
          .addTo(map)
      })

      // this.$L.marker([10.7381, 106.7302]).addTo(map)
    })
    console.log('mounted')
  }
}
</script>
