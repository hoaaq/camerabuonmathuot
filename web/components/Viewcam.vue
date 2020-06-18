<template>
  <v-container no-gutters>
    <v-card loading="false" tile>
      <canvas></canvas>
    </v-card>
    <v-divider class="pa-3"></v-divider>
    <v-card>
      <v-row>
        <v-col cols="11" class="pl-10 mt-5" xs="8" sm="8" md="9" lg="9" xl="10">
          <v-slider
            label="Giay"
            max="60"
            :value="parseInt(pickedSec)"
            @change="selectSec"
          >
          </v-slider>
        </v-col>
        <v-col
          cols="12"
          xs="4"
          sm="4"
          md="3"
          lg="3"
          xl="2"
          class="d-flex align-center justify-center"
        >
          <v-menu transition="slide-y-transition" top light min-width="60px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" text min-width="25px" v-on="on">
                {{ pickedHour }}
              </v-btn>
            </template>
            <v-list height="200" class="overflow-y-auto">
              <v-list-item
                v-for="(h, i) in hour"
                :key="h"
                @click="selectHour(i)"
              >
                <v-list-item-title>{{ h }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          :
          <v-menu transition="slide-y-transition" top light min-width="60px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" text min-width="25px" v-on="on">
                {{ pickedMin }}
              </v-btn>
            </template>
            <v-list height="200" class="overflow-y-auto">
              <v-list-item v-for="m in min" :key="m" @click="selectMin(m)">
                <v-list-item-title>{{ m }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          :
          <v-menu transition="slide-y-transition" top light min-width="60px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" text min-width="25px" v-on="on">
                {{ pickedSec }}
              </v-btn>
            </template>
            <v-list height="200" class="overflow-y-auto">
              <v-list-item v-for="s in second" :key="s" @click="selectSec(s)">
                <v-list-item-title>{{ s }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    pickedHour: '00',
    pickedMin: '00',
    pickedSec: '00'
  }),
  computed: {
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
    const cv = document.querySelector('canvas')
    cv.height *= 1.12
  },
  methods: {
    selectHour(h) {
      this.pickedHour = h < 10 ? '0' + h : '' + h
    },
    selectMin(m) {
      this.pickedMin = m < 10 ? '0' + m : '' + m
    },
    selectSec(s) {
      this.pickedSec =
        s.toString() < 10 ? '0' + s.toString() : '' + s.toString()
    }
  }
}
</script>
<style scoped>
canvas {
  height: 100%;
  width: 100%;
}
</style>
