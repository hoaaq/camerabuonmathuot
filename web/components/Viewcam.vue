<template>
  <v-container no-gutters>
    <v-card loading="false" tile>
      <canvas></canvas>
    </v-card>
    <v-divider class="pa-3"></v-divider>
    <v-card>
      <v-row>
        <v-col cols="8" class="pl-10 mt-5" xs="8" sm="9" md="9" lg="9" xl="10">
          <v-slider label="Phut" max="60" @change="pickMinute"> </v-slider>
        </v-col>
        <v-col
          cols="4"
          xs="4"
          sm="3"
          md="3"
          lg="3"
          xl="2"
          class="d-flex align-center justify-start"
        >
          <span>{{ hour }}:{{ minute }}</span>
          <v-card class="pr-2 pl-2 ml-2 mr-2">
            <v-icon color="blue-grey darken-2" medium @click="pickHour('up')"
              >mdi-plus</v-icon
            >
            <br />
            <v-icon color="blue-grey darken-2" medium @click="pickHour('down')"
              >mdi-minus</v-icon
            >
          </v-card>
          <v-btn min-width="42px" :light="darkmode" @click="pickDatetime">
            {{ darkmode ? 'AM' : 'PM' }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    darkmode: true,
    minute: '00',
    hour: 12,
    time: null,
    date: null
  }),
  mounted() {
    const cv = document.querySelector('canvas')
    cv.height *= 1.12
    this.$root.$on('dateQuery', (date) => {
      this.date = date
    })
  },
  methods: {
    pickMinute(event) {
      this.minute = event.toString()
      this.timeQuery()
    },
    pickHour(action) {
      if (action === 'up')
        if (this.hour === 12) {
          this.hour = 1
          this.pickDatetime()
        } else this.hour++
      else if (this.hour <= 1) {
        this.hour = 12
        this.pickDatetime()
      } else this.hour--
      this.timeQuery()
    },
    timeQuery() {
      this.time = this.hour + ':' + this.minute
      this.$root.$emit('timeQuery', this.time)
      this.requestDataPlayBack()
    },
    pickDatetime() {
      this.darkmode = !this.darkmode
      if (this.darkmode) console.log('day')
      else console.log('night')
    },
    requestDataPlayBack() {
      console.log(this.date + '\\' + this.time)
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
