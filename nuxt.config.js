//import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - first_pwa',
    title: 'first_pwa',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/scss/_reset.scss'
  ],

  env: {
    API_URL: process.env.API_URL || '',
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/utils'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources',
    '@nuxtjs/onesignal',
    "@nuxtjs/pwa"
  ],

  manifest: {
    name: "first_pwa",
    lang: "ja",
    short_name: "first_pwa",
    title: "first_pwa",
    "og:title": "first_pwa",
    description: "nuxt.jsでpwa開発",
    "og:description": "nuxt.jsでpwa開発",
    theme_color: "#000000",
    background_color: "#000000",
    icons: [
      {
        "src": "static/icon.png",
        "sizes": "512x512",
        "type": "image/png"
      },
    ]
  },

  workbox: {
    dev: false, // Service Workerを開発環境で使用するかどうか
  },

  oneSignal: {
    init: {
      appId: '2e852bab-0fce-489e-a03f-367dd5778755',
      allowLocalhostAsSecureOrigin: true,
      welcomeNotification: {
        disable: true
      }
    },
    importScripts: ['sw.js'], 
  },

  styleResources: {
    scss: [
      '@/assets/scss/_variables.scss',
    ]
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  // vuetify: {
  //   customVariables: ['~/assets/variables.scss'],
  //   theme: {
  //     dark: false,
  //     themes: {
  //       dark: {
  //         primary: colors.blue.darken2,
  //         accent: colors.grey.darken3,
  //         secondary: colors.amber.darken3,
  //         info: colors.teal.lighten1,
  //         warning: colors.amber.base,
  //         error: colors.deepOrange.accent4,
  //         success: colors.green.accent3
  //       }
  //     }
  //   }
  // },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
