<template>
  <div class="mt-3 mb-5">
    <h2 class="title mb-2">{{ title }}</h2>
    <v-divider />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Page Title'
    }
  }
}
</script>
