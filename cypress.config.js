const { defineConfig } = require("cypress");
const fs = require("fs");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        fileCheck(filename) {
          return fs.existsSync(filename);
        },
        fileSave([fileName, data]) {
          fs.writeFileSync(fileName, data);
          return null;
        },
        fileRead(fileName) {
          data = fs.readFileSync(fileName, "utf8");
          return data;
        },
        folderRemove(folderPath) {
          console.log(process.cwd());
          try {
            fs.rmSync(folderPath, { recursive: true });
            return null; // Return null on success
          } catch (error) {
            if (error.message.includes("ENOENT: no such file or directory")) {
              return null;
            } else {
              throw error; // Re-throw other errors to fail the test
            }
          }
        },
      });
    },
    viewportHeight: 1080,
    viewportWidth: 1920,
  },
  env: {
    imageCompareFailResponse: "warning",
    disableLogs: true,
  },
});
