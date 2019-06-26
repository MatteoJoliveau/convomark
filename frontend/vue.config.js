module.exports = {
  devServer: {
    disableHostCheck: true
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'i18n',
      enableInSFC: true
    },
    pwa: {
      themeColor: '#fafafa'
    }
  }
}
