module.exports = {
  devServer: {
    port: 80,
    public: 'http://microwave.home.local',
    disableHostCheck: true,
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'i18n',
      enableInSFC: true
    }
  }
};
