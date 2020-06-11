<template>
  <v-container no-gutters>
    <v-card loading="false" tile>
      <canvas></canvas>
    </v-card>
    <v-divider class="pa-5"></v-divider>
    <v-card class="pt-5">
      <v-card-text style="margin-bottom: -35px">
        <v-slider
          v-model="slider"
          label="Phut"
          :thumb-size="30"
          max="60"
          thumb-label="always"
          @change="pickMinute"
        >
        </v-slider>
      </v-card-text>
      <v-card-text>
        <v-slider
          id="hour"
          :tick-labels="ticksLabels"
          :max="23"
          label="Gio"
          step="1"
          tick-size="3"
          @change="datetime"
        ></v-slider>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    ticksLabels: [
      '0h',
      '1h',
      '2h',
      '3h',
      '4h',
      '5h',
      '6h',
      '7h',
      '8h',
      '9h',
      '10h',
      '11h',
      '12h',
      '13h',
      '14h',
      '15h',
      '16h',
      '17h',
      '18h',
      '19h',
      '20h',
      '21h',
      '22h',
      '23h'
    ]
  }),
  mounted() {},
  methods: {
    datetime(event) {
      console.log(event)
    },
    pickMinute(event) {
      console.log(event)
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
