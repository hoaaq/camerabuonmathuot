<template>
  <v-container class="pa-1">
    <v-row no-gutters>
      <v-col cols="12" lg="9">
        <Viewcam />
      </v-col>
      <v-col cols="12" lg="3">
        <Selection />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Viewcam from '~/components/Viewcam.vue'
import Selection from '~/components/Selection.vue'

export default {
  components: {
    Viewcam,
    Selection
  }
}
</script>
<style scoped></style>
<style lang="scss" scoped src="./index.scss"></style>
