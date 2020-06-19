module.exports = {
  mode: 'universal',
  head: {
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
  loading: { color: '#fff' },
  css: [],
  plugins: [],
  buildModules: ['@nuxtjs/eslint-module'],
  modules: ['@nuxtjs/axios'],
  axios: {},
  router: {
    base: '/nuxt/'
  },
  build: {
    optimization: {
      runtimeChunk: false,
      splitChunks: {
        chunks: 'async',
        cacheGroups: {
          commons: {
            chunks: 'async'
          }
        }
      }
    },
    filenames: {
      app: '[name].js',
      chunk: '[name].js'
    }
  },
  server: {
    host: '0.0.0.0',
    port: 9601
  }
};
