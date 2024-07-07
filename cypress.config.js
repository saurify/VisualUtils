const { error } = require("console");
const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");

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
        deleteFile(fileName) {
          if (fs.existsSync(fileName)) {
            try {
              fs.unlinkSync(fileName);
            } catch (error) {
              throw error;
            }
          }
          return null;
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
      }),
        on("after:screenshot", (details) => {
          console.log(details.name)
          if (path.basename(details.name).startsWith("b- ")) {
            const customBaselineFolder = "/cypress/baselineImages/"; //config.configFile.env("baselineImageDir");
            const projectRoot = config.projectRoot;
            const newPath = path.join(
              projectRoot,
              customBaselineFolder,
              path.basename(details.path)
            );
            if (!fs.existsSync(path.join(projectRoot, customBaselineFolder))) {
              fs.mkdirSync(path.join(projectRoot, customBaselineFolder), {
                recursive: true,
              });
            }
            try {
              fs.renameSync(details.path, newPath);
              console.log(`Moved baseline to ${newPath}`);
              details.path = newPath;
              console.log("this passed")
              return details;
            } catch (err) {
              throw err;
            }
          }
          
        });
    },
    viewportHeight: 1080,
    viewportWidth: 1920,
  },
  env: {
    imageCompareFailResponse: "warning",
    disableLogs: true,
    baselineImageDir: "cypress/baselineImages/",
  },
});
