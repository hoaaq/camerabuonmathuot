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
            v-for="(item, i) in listcam"
            :key="i"
            @click="handleSelectcam(item)"
          >
            <v-list-item-content>
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
    listcam() {
      this.getListCam()
      const lscam = this.$store.state.playback.listcam
      return lscam
    }
  },
  mounted() {
    this.$root.$on('timeQuery', (time) => {
      this.time = time
    })
  },
  methods: {
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
    datetime(event) {
      this.date = event
      this.$root.$emit('dateQuery', this.date)
      this.requestDataPlayBack()
    },
    requestDataPlayBack() {
      console.log(this.date + '\\' + this.time)
    }
    //         ctx.drawImage(
    //           image,
    //           0,
    //           0,
    //           image.width,
    //           image.height,
    //           0,
    //           0,
    //           canvas.width,
    //           canvas.height
    //         )
    //       }
    //       image.src = 'data:image/jpg;base64, ' + data
    //     })
    //   })
    // }
    // async draw() {
    //   for (let i = 1; i < 7; i++) {
    //     let img = new Image()
    //     const cv = document.querySelector('canvas')
    //     const ctx = cv.getContext('2d')
    //     // ctx.scale(2, 2)
    //     // ctx.scale(2, 2)
    //     // cv.height *= 4
    //     // cv.width *= 4
    //     img = await this.getsrc(i)
    //     ctx.drawImage(
    //       img,
    //       0,
    //       0,
    //       img.width,
    //       img.height,
    //       0,
    //       0,
    //       cv.width,
    //       cv.height
    //     )
    //   }
    // }
  }
}
</script>
