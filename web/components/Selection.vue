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
        <v-radio-group style="height: 380px" class="overflow-y-auto">
          <v-list-item v-for="item in items" :key="item">
            <div
              class="d-flex align-center justify-center"
              style="cursor: pointer"
              @click="makePickCam(item)"
            >
              <v-radio
                :id="item"
                :value="item"
                @click="pickCam2(item)"
              ></v-radio>
              <v-list-item-title class="mb-2" v-text="item"></v-list-item-title>
            </div>
          </v-list-item>
        </v-radio-group>
      </v-card>
    </v-container>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    items: [
      'Cam 1',
      'Cam 2',
      'Cam 3',
      'Cam 4',
      'Cam 5',
      'Cam 6',
      'Cam 7',
      'Cam 8',
      'Cam 9',
      'Cam 10',
      'Cam 11'
    ],
    inputs: []
    // model: ['Cam 1']
  }),
  methods: {
    datetime(event) {
      console.log(event)
    },
    pickCam2(items) {
      console.log(items)
      this.drawCanvas()
    },
    makePickCam(item) {
      // document.get
      // document.getElementById(item).click()
      // this.drawCanvas()
    },
    getsrc(i) {
      return new Promise(function(resolve) {
        const img = new Image()
        img.src = require('~/assets/' + i + '.jpg')
        resolve(img)
      })
    },
    async drawCanvas() {
      console.log('draw')
      let img = new Image()
      // img.src = require('~/assets/2.jpg')
      const cv = document.querySelector('canvas')
      const ctx = cv.getContext('2d')
      // ctx.scale(2, 2)
      // ctx.scale(2, 2)
      // cv.height *= 4
      // cv.width *= 4
      const i = 1
      while (true) {
        img = await this.getsrc(i)
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          0,
          0,
          cv.width,
          cv.height
        )
      }
    }
  }
}
</script>
