const i18n = require('./config/locales');

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s Sàn du lịch thành phố Móng Cái',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' },
      {
        hid: 'description',
        name: 'description',
        content: 'Sàn du lịch thành phố Móng Cái'
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: 'san du lich, yen bai'
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: 'website'
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'Sàn du lịch thành phố Móng Cái'
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: 'sandulichyenbai.vn'
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: '/icons/logo.ico'
      },
      {
        hid: 'description',
        property: 'description',
        content: 'Sàn du lịch thành phố Móng Cái'
      },
      {
        hid: 'twitter:title',
        property: 'twitter:title',
        content: 'Sàn du lịch thành phố Móng Cái'
      },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        hid: 'twitter:site',
        name: 'twitter:site',
        content: '@sandulicyenbai'
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: '/icons/logo.ico'
      },
      {
        hid: 'twitter:image:src',
        name: 'twitter:image:src',
        content: '/icons/logo.ico'
      },
      {
        hid: 'twitter:description',
        property: 'twitter:description',
        content: 'Sàn du lịch thành phố Móng Cái'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/icons/logo.ico' }],
    // script: [
    //   {
    //     src: 'https://sp.zalo.me/plugins/sdk.js',
    //     body: true
    //   }
    // ]
  },

  env: {
    BASE_ORIGIN_LOCATION: process.env.BASE_ORIGIN_LOCATION,
    GG_MAP_KEY: process.env.GG_MAP_KEY,
    FB_API_KEY: process.env.FB_API_KEY,
    FB_AUTH_DOMAIN: process.env.FB_AUTH_DOMAIN,
    FB_DB_URL: process.env.FB_DB_URL,
    FB_PROJECT_ID: process.env.FB_PROJECT_ID,
    FB_STORAGE_BUCKET: process.env.FB_STORAGE_BUCKET,
    FB_MESSAGING_SENDER_ID: process.env.FB_MESSAGING_SENDER_ID,
    FB_APP_ID: process.env.FB_APP_ID,
    FB_MEASUREMENT_ID: process.env.FB_MEASUREMENT_ID,
    FB_FCM_PUBLIC_VAPI_KEY: process.env.FB_FCM_PUBLIC_VAPI_KEY,
    FB_CLIENT_ID: process.env.FB_CLIENT_ID,
    FB_REDIRECT_URI: process.env.FB_REDIRECT_URI,
    GG_CLIENT_ID: process.env.GG_CLIENT_ID,
    GG_REDIRECT_URI: process.env.GG_REDIRECT_URI,
    FB_CHAT_PAGE_ID: process.env.FB_CHAT_PAGE_ID,
    FB_CHAT_THEME_COLOR: process.env.FB_CHAT_THEME_COLOR,
    FB_CHAT_LOCALE: process.env.FB_CHAT_LOCALE,
    FB_CHAT_ATTRIBUTION: process.env.FB_CHAT_ATTRIBUTION,
    FB_CHAT_LOGGED_IN_GREETING: process.env.FB_CHAT_LOGGED_IN_GREETING,
    FB_CHAT_LOGGED_OUT_GREETING: process.env.FB_CHAT_LOGGED_OUT_GREETING,
    ZALO_PHONE: process.env.ZALO_PHONE,
    ZALO_CHAT_OAID: process.env.ZALO_CHAT_OAID,
    ZALO_CHAT_WELCOME_MSG: process.env.ZALO_CHAT_WELCOME_MSG,
    ZALO_CHAT_AUTO_POPUP: process.env.ZALO_CHAT_AUTO_POPUP,
    ZALO_CHAT_WIDTH: process.env.ZALO_CHAT_WIDTH,
    ZALO_CHAT_HEIGHT: process.env.ZALO_CHAT_HEIGHT,
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~assets/scss/style.scss'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/global',
    '~/plugins/directives',
    '~/plugins/filters',
    '~/plugins/moment',
    {
      src: '~/plugins/vue-awesome-swiper',
      mode: 'client'
    },
    { src: '@/plugins/axios.js', ssr: true },
    { src: '~/plugins/google-maps', ssr: true },
    { src: '~/plugins/vue-sticky-directive', ssr: false },
    { src: '~/plugins/vuelidate', ssr: false },
    { src: '@/plugins/vue-scrollto.js', ssr: false },
    { src: '@/plugins/vue-scroll-loader.js', ssr: false },
    { src: '@plugins/leaflet.js', ssr: false },
    { src: '~/plugins/fb-messenger.js', ssr: false }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxtjs/svg',
    '@nuxtjs/style-resources',
    '@nuxtjs/dotenv',
    '@nuxtjs/firebase',
    '@nuxtjs/moment'
  ],

  styleResources: {
    scss: [
      '~assets/scss/abstracts/*.scss',
      '~assets/scss/vendors/_include-media.scss',
      '~assets/scss/vendors/_poly-fluid-sizing.scss',
      '~assets/scss/mixins/*.scss'
    ]
  },

  /**
   * Global middleware
   */
  router: {
    middleware: ['check-auth']
  },

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/firebase',
    [
      'nuxt-leaflet',
      {
        /* module options */
      }
    ],
    [
      'vue-social-sharing/nuxt',
      {
        networks: {
          fakeblock: 'https://fakeblock.com/share?url=@url&title=@title',
          twitter: 'https://twitter.com/share?url=@url&title=@title'
        }
      }
    ],
    [
      '@nuxtjs/toast',
      {
        keepOnHover: true,
        register: [
          // Register custom toasts
          {
            name: 'primary',
            message: (payload) => payload,
            options: {
              type: 'primary'
            }
          }
        ]
      }
    ],
    ['nuxt-i18n', i18n]
  ],

  firebase: {
    config: {
      apiKey: process.env.FB_API_KEY,
      authDomain: process.env.FB_AUTH_DOMAIN,
      databaseURL: process.env.FB_DB_URL,
      projectId: process.env.FB_PROJECT_ID,
      storageBucket: process.env.FB_STORAGE_BUCKET,
      messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
      appId: process.env.FB_APP_ID,
      measurementId: process.env.FB_MEASUREMENT_ID,
      fcmPublicVapidKey: process.env.FB_FCM_PUBLIC_VAPI_KEY
    },
    services: {
      messaging: {
        createServiceWorker: true
      }
    }
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: process.env.BASE_URL_API, // Default: http://[HOST]:[PORT][PREFIX]
    // proxy: true,
    // prefix: '/api/',
    redirectError: {
      401: '/login',
      404: '/404'
    },
    retry: {
      retries: 0
    }, // interceptor retry time request
    debug: false // default false},
  },

  // proxy: {
  //   '/api/upload/': {
  //     target: process.env.BASE_URL_UPLOAD,
  //     pathRewrite: { '^/api/upload/': '/upload/' }
  //   },
  //   '/api/': {
  //     target: process.env.BASE_URL_API,
  //     changeOrigin: true
  //   },
  // },

  /*
   ** Toast module configuration
   */
  toast: {
    position: 'top-right',
    theme: 'bubble',
    duration: 3000,
    iconPack: 'material'
  },

  server: {
    host: "0.0.0.0",
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    /**
     ** Config or css prefix version
     */
    postcss: {
      plugins: {
        autoprefixer: { overrideBrowserslist: 'last 2 versions' }
      }
    },
    transpile: [/^vue2-google-maps($|\/)/]
  }
};
