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
        <!--        <v-list shaped>-->
        <!--          <v-list-item-group v-model="model" multiple>-->
        <!--            <template v-for="(item, i) in items">-->
        <!--              <v-divider v-if="!item" :key="`divider-${i}`"></v-divider>-->
        <!--              <v-list-item-->
        <!--                v-else-->
        <!--                :key="`item-${i}`"-->
        <!--                :value="item"-->
        <!--                active-class="deep-purple&#45;&#45;text text&#45;&#45;accent-4"-->
        <!--              >-->
        <!--                <template v-slot:default="{ active }">-->
        <!--                  <v-list-item-content>-->
        <!--                    <v-list-item-title v-text="item"></v-list-item-title>-->
        <!--                  </v-list-item-content>-->

        <!--                  <v-list-item-action>-->
        <!--                    <v-checkbox-->
        <!--                      :input-value="active"-->
        <!--                      :true-value="item"-->
        <!--                      disabled="true"-->
        <!--                      color="deep-purple accent-4"-->
        <!--                      @change="pickCam($event, i, items)"-->
        <!--                    ></v-checkbox>-->
        <!--                  </v-list-item-action>-->
        <!--                </template>-->
        <!--              </v-list-item>-->
        <!--            </template>-->
        <!--          </v-list-item-group>-->
        <!--        </v-list>-->
        <v-radio-group style="height: 377px" class="overflow-y-auto">
          <v-list-item v-for="(item, i) in items" :key="item">
            <v-list-item-content>
              <v-list-item-title v-text="item"></v-list-item-title>
            </v-list-item-content>
            <v-radio :value="item" @change="pickCam2(i, items)"></v-radio>
          </v-list-item>
        </v-radio-group>
      </v-card>
    </v-container>
  </v-container>
</template>
<script>
const camActive = []
let inter
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
    pickCam(event, idx, items) {
      if (event) camActive.push(items[idx])
      else camActive.splice(camActive.indexOf(items[idx]), 1)
      console.log(camActive)
    },
    pickCam2(i, items) {
      console.log(items[i])
      this.drawCanvas()
    },
    drawCanvas() {
      clearInterval(inter)
      console.log('draw')
      const img = new Image()
      // img.src = require('~/assets/2.jpg')
      const cv = document.querySelector('canvas')
      const ctx = cv.getContext('2d')
      ctx.scale(2, 2)
      ctx.scale(2, 2)
      cv.height *= 4
      cv.width *= 4
      // for (let i = 0; i < 10; i++) {
      // for (let j = 1; j < 7; j++) {
      let i = 1
      inter = setInterval(function() {
        img.src = require('~/assets/' + i + '.jpg')
        setTimeout(function() {
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
        }, 100)

        if (i === 7) i = 1
        else i++
      }, 500)
    }
  }
}
</script>
