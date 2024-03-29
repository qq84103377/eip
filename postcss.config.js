module.exports = {
  plugins: {
    // autoprefixer: {},
    // "postcss-import": {},
    // "postcss-url": {},
    // "postcss-aspect-ratio-mini": {},
    // "postcss-write-svg": {
    //   utf8: false
    // },
    // "postcss-cssnext": {},
    "postcss-px-to-viewport": {
      viewportWidth: 1920,     // (Number) The width of the viewport.
      viewportHeight: 1080,    // (Number) The height of the viewport.
      unitPrecision: 3,       // (Number) The decimal numbers to allow the REM units to grow to.
      viewportUnit: 'vw',     // (String) Expected units.
      selectorBlackList: ['.ignore', '.hairlines'],  // (Array) The selectors to ignore and leave as px.
      minPixelValue: 1,       // (Number) Set the minimum pixel value to replace.
      mediaQuery: false,       // (Boolean) Allow px to be converted in media queries.
      // propList:['!font*'],
      // landscape: true,
      // // // 横屏时使用的单位
      // landscapeUnit: 'vw',
      // // // 横屏时使用的视口宽度
      // landscapeWidth: 667
    },
    "postcss-viewport-units":{
      filterRule: rule => rule.selector.indexOf('::after') === -1 && rule.selector.indexOf('::before') === -1 && rule.selector.indexOf(':after') === -1 && rule.selector.indexOf(':before') === -1
    },
    // "cssnano": {
    //   preset: "advanced",
    //   autoprefixer: false,
    //   "postcss-zindex": false
    // }
  }
}
