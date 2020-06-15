<template>
  <v-container class="pa-0">
    <v-container>
      <v-card tile>
        <v-date-picker full-width @change="datetime"></v-date-picker>
      </v-card>
    </v-container>
    <v-container>
      <v-card tile>
        <v-card-title>Cam list</v-card-title>
        <div class="ml-3">
          <v-text-field
            v-model="searchString"
            label="Tìm kiếm"
            @input="
              searchString.length < 5 ? throttlesearch() : debouncesearch()
            "
          ></v-text-field>
        </div>
        <v-overlay :value="searchOverlay" absolute>
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-overlay>
        <v-list two-line style="height: 327px" class="overflow-y-auto">
          <v-list-item
            v-for="(item, i) in listCam"
            :key="i"
            @click="handleSelectcam(item)"
          >
            <v-list-item-content @click="selectCam(item)">
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.fulltext }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-container>
  </v-container>
</template>
<script>
import _ from 'lodash'
// import soc from '~/plugins/socket.io'

export default {
  async middleware({ store }) {
    await store.dispatch('playback/getcams', { input: null })
  },
  data() {
    return {
      itv: undefined,
      searchOverlay: false,
      searchString: null,
      loadCam: false,
      date: null,
      time: null
    }
  },
  computed: {
    listCam() {
      this.getListCam()
      return this.$store.state.playback.listcam
    },
    selectedcam() {
      const selectedcam = this.$store.state.map.selectedcam
      this.setnullCam()
      return selectedcam
    }
  },
  mounted() {
    this.$root.$on('timeQuery', (time) => {
      this.time = time
    })

    this.$nextTick(() => {
      const canvas = document.querySelector('canvas')
      const ctx = canvas.getContext('2d')
      ctx.scale(2, 2)
      canvas.height *= 2
      canvas.width *= 2

      if (this.selectedcam.input) {
        this.selectCam(this.selectedcam.input)
      }
    })
  },
  methods: {
    async getListCam() {
      if (!this.loadCam) {
        this.loadCam = !this.loadCam
        await this.$store.dispatch('playback/getcams', { input: null })
      }
    },
    async setnullCam() {
      await this.$store.dispatch('map/selectcam', { input: null })
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
    datetime(event) {
      this.date = event
      this.$root.$emit('dateQuery', this.date)
      this.requestDataPlayBack()
    },
    requestDataPlayBack() {
      console.log(this.date + '\\' + this.time)
    },
    selectCam(item) {
      const canvas = document.querySelector('canvas')
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = '30px Arial'
      ctx.fillText(JSON.stringify(item), 10, 50)
    }
  }
}
</script>
