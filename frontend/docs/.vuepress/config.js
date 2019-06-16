module.exports = {
  base: '/docs/',
  title: 'ConvoMark - Documentation',
  description: '',
  dest: 'dist/docs',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'User Guide', link: '/user/' },
      { text: 'Developer Guide', link: '/development/' },
      { text: 'About', link: '/about' },
    ],
    sidebar: 'auto',
  },
};
