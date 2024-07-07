// const fs = require("fs-extra");
const PNG = require("pngjs").PNG;
import pixelmatch from "./compareutils";

const defaultPathOptions = {
  baselineImagePath: "./images/baselineImages/",
  testImagePath: "./images/testImages/",
  resultImagePath:
    "C:/dev/platform/settingevaluator/SettingEvaluator/Apt.Platform.SettingEvaluator.Tests/cypress/screenshots/images/results/",
  baselineImageName: "f1.png",
  testImageName: "t1.png",
};
let hasFailed = 0;

export async function testImage(config) {
  let pathOptions = Object.assign({}, defaultPathOptions, config);
  // console.log(Object.keys(fs))
  // const imgB = PNG.sync.read(fs.readFileSync('C:\dev\platform\settingevaluator\SettingEvaluator\Apt.Platform.SettingEvaluator.Tests\cypress\screenshots\images\baselineImages'+ 'b- Quick_Help.png'));
  // const imgT = PNG.sync.read(fs.readFileSync("C:\dev\platform\settingevaluator\SettingEvaluator\Apt.Platform.SettingEvaluator.Tests\cypress\screenshots\images\testImages" + 't- Quick_Help.png'));
  let imgB;
  let imgT;
  let fail;
  cy.readFile(
    pathOptions.rootDir +
      pathOptions.baselineImagePath +
      config.baselineImageName +
      config.extension,
    "binary"
  )
    .then((imgBdata) => {
      imgB = PNG.sync.read(Buffer.from(imgBdata, "binary"));
    })
    .then(() => {
      cy.readFile(
        pathOptions.rootDir +
          pathOptions.testImagePath +
          config.testImageName +
          config.extension,
        "binary"
      ).then((imgTdata) => {
        // console.log("done reading test image data", imgTdata);
        imgT = PNG.sync.read(Buffer.from(imgTdata, "binary"));
      });
    })
    .then(() => {
      const { width, height } = imgB;
      const diff = new PNG({ width, height });
      fail = pixelmatch(imgB.data, imgT.data, diff.data, width, height, config);
      config.resultName = config.testName;
      cy.writeFile(
        pathOptions.rootDir +
          pathOptions.resultImagePath +
          config.resultName +
          ".png",
        PNG.sync.write(diff),
        { encoding: "binary" }
      ).then(() => {
        config.status = fail > 0 ? false : true;
        if (fail) {
          callFail();
        }
        console.log(config);
        // return config
      });
    });

  //method = error|warning

  //   let imgTdata;
  //   //   console.log("done reading baseline image data", imgBdata)

  //   console.log("Processed baseline image");
  //   //   let imgTdata = await cy.readFile(
  //   //     "C:/dev/platform/settingevaluator/SettingEvaluator/Apt.Platform.SettingEvaluator.Tests/cypress/screenshots/images/testImages/" +
  //   //       "t- Quick_Help.png", 'binary'
  //   //   );
  //   console.log("done reading baseline image data", imgBdata);
  //   //   const imgT = PNG.sync.read(Buffer.from(imgTdata, 'binary'));
  //   console.log("Processed test image");
}
export function callFail() {
  if (Cypress.env("imageCompareFailResponse") === "error") {
    throw new Error(
      "Difference setected, visit screenshots/results to check for the differences in baseline image and test image"
    );
  } else {
    cy.log(
      "Differenece detected, check difference image in screenshots/results folder"
    );
  }
}

export async function remoceFilesFromFolder(folderPath) {
  // Get a list of all files in the folder
  return fs.promises
    .readdir(folderPath)
    .then((files) => {
      // Iterate over each file and delete it
      const promises = files.map((file) => {
        return fs.promises.unlink(`${folderPath}/${file}`);
      });

      // Wait for all deletions to complete
      return Promise.all(promises);
    })
    .catch((err) => {
      console.error("Error removing files in folder:", err);
    });
}
