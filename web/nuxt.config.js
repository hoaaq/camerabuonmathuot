require('dotenv').config()

export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { 
    color: '#FFAB40',
    throttle: 0,
    continuous: true
  },
  /*
   ** Global CSS
   */
  css: [
    '@/assets/main.scss',
    '@/node_modules/sweetalert2/dist/sweetalert2.min.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/veevalidate.js",
    '~/plugins/globalComponents.js',
    // { 
    //   src: '~/plugins/socket.io.js',
    //   ssr: false,
    // },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv'
  ],
  eslint: {
    fix: true
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/auth',
    '@nuxtjs/toast',
    ['vue-sweetalert2/nuxt',{
      icon: 'warning',
      title: 'Vui lòng xác nhận',
      confirmButtonColor: '#F57C00',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy bỏ',
      showCancelButton: true,
      reverseButtons: true
    }]
  ],
  env: {
    wsUrl: process.env.WS_URL || 'ws://localhost:4001'
  },
  toast: {
      position: 'bottom-right',
      duration: 2000
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.API_BASE_URL,
    browserBaseURL: process.env.API_BROWSER_URL
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/user/login', method: 'post', propertyName: 'token' },
          logout: { url: '/user/logout', method: 'post' },
          user: { url: '/user/me', method: 'get', propertyName: 'user' }
        },
        tokenRequired: true,
        tokenType: 'bearer',
        autoFetchUser: false
      }
    },
    redirect: false
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    optionsPath: './vuetify.options.js'
  },
  /*
   ** Build configuration
   */
  build: {
    transpile: ["vee-validate/dist/rules"],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      config.node = {
        fs: "empty"
      }
    }
  },
  layoutTransition: {
    name: 'layout',
    mode: 'out-in'
  },
  pageTransition: {
    name: 'page',
    mode: 'out-in'
  },
  // server: {
  //   host: '0' // default: localhost
  // }
}
