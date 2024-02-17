const { defineConfig } = require("cypress");
const fs = require('fs')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        fileCheck(filename) {
          return fs.existsSync(filename)
        },
        fileSave([fileName, data]) { 
          fs.writeFileSync(fileName, data)
          return null
        },
        fileRead(fileName){
          data = fs.readFileSync(fileName, 'utf8')
          return data
        }
      })
    },
    viewportHeight: 1080,
    viewportWidth: 1920,
  },
});
