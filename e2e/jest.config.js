module.exports = {
  preset: "jest-puppeteer",
  args:['--start-maximized' ],
  /*globals: {
    URL: "http://localhost:3000/checkout/cart"
  },*/
  testMatch: ["**/specs/*.js","**/specs/**/*.js"],
  transform: {
    "\\.js$": "react-scripts/config/jest/babelTransform"
  },
  verbose: true,
  setupFilesAfterEnv: [  // NOT setupFiles
    "./jest.setup.js"
]
};
