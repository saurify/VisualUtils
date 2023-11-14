// const fs = require("fs-extra");
const PNG = require("pngjs").PNG;
import pixelmatch from "./compareutils";
 
module.exports = testImage;
 
const defaultPathOptions = {
  baselineImagePath: "./images/baselineImages/",
  testImagePath: "./images/testImages/",
  resultImagePath:
    "C:/dev/platform/settingevaluator/SettingEvaluator/Apt.Platform.SettingEvaluator.Tests/cypress/screenshots/images/results/",
  baselineImageName: "f1.png",
  testImageName: "t1.png",
};
 
async function testImage(config) {
  let pathOptions = Object.assign({}, defaultPathOptions, config);
  // console.log(Object.keys(fs))
  // const imgB = PNG.sync.read(fs.readFileSync('C:\dev\platform\settingevaluator\SettingEvaluator\Apt.Platform.SettingEvaluator.Tests\cypress\screenshots\images\baselineImages'+ 'b- Quick_Help.png'));
  // const imgT = PNG.sync.read(fs.readFileSync("C:\dev\platform\settingevaluator\SettingEvaluator\Apt.Platform.SettingEvaluator.Tests\cypress\screenshots\images\testImages" + 't- Quick_Help.png'));
  let imgB;
  let imgT;
  let fail;
  cy.readFile(
    pathOptions.rootDir + pathOptions.baselineImagePath + config.baselineImageName + config.extension,
    "binary"
  )
    .then((imgBdata) => {
      imgB = PNG.sync.read(Buffer.from(imgBdata, "binary"));
    })
    .then(() => {
      cy.readFile(
        pathOptions.rootDir + pathOptions.testImagePath + config.testImageName + config.extension,
        "binary"
      ).then((imgTdata) => {
        console.log("done reading test image data", imgTdata);
        imgT = PNG.sync.read(Buffer.from(imgTdata, "binary"));
      });
    })
    .then(() => {
      const { width, height } = imgB;
      const diff = new PNG({ width, height });
      fail = pixelmatch(
        imgB.data,
        imgT.data,
        diff.data,
        width,
        height,
        config
      );
      cy.writeFile(
        pathOptions.rootDir +pathOptions.resultImagePath + config.testName + ".png",
        PNG.sync.write(diff),
        { encoding: "binary" }
      );
    })
    .then(() => {
      return fail;
    });
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