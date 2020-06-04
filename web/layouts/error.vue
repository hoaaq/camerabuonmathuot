<template>
  <v-app>
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else-if="error.statusCode === 401">
      {{ permissionDenied }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink to="/">
      Trang chủ
    </NuxtLink>
  </v-app>
</template>

<script>
export default {
  middleware: 'checkauth',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: 'Không tìm thấy trang',
      permissionDenied: 'Không có quyền thực thi trên trang',
      otherError: 'Có lỗi xảy ra'
    }
  },
  head() {
    const title =
      this.error.statusCode === 404
        ? this.pageNotFound
        : this.error.statusCode === 401
        ? this.permissionDenied
        : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
