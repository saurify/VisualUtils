// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { testImage, baseScreenshotRunDir } from "./utils";

export const defaultConfig = {
  isTest: true,
  threshold: 0.1,
  alpha: 0.1,
  baselineImagePath: Cypress.env("baselineImageDir"),
  testImagePath: "images/testImages/",
  resultImagePath: "images/results/",
  testName: "testName.png",
  baselineImageName: "b- testName",
  testImageName: "t- testName",
  rootDir: "cypress/screenshots/",
  logFilename: "logs.json",
  extension: ".png",
  blackout: [], //selectors of components you want to blackout
};

Cypress.Commands.add("_", () => {
  return;
});
//config should contain {testName: name, isTest:true, }
Cypress.Commands.add("visualTest", (selector, config) => {
  config = Object.assign({}, defaultConfig, config);

  // let testResult = false;
  config.baselineImageName = "b- " + config.testName;
  logManager(config).then((data) => {
    config = data;
    config.blackout.forEach((blackoutSelector) => {
      cy.get(blackoutSelector).invoke("hide");
    });
    cy.get(selector).then(($el) => {
      if (!config.isTest){
        cy.task(
          "deleteFile",
          Cypress.env("baselineImageDir") + config.baselineImageName
        ).should("be.null");
      }
      ssGenerator($el, config);
      if (config.isTest) {
        testImage(config);

        //   testImage((config)).then((resConfig)=>{
        //     console.log("res",resConfig)
        //     let testResult = resConfig

        //   if (testResult.fail) {
        //     cy.log("Visual regression passed for : ", config.testName)
        //   }
        //   else {
        //     cy.log("Visual regression failed for : ", config.testName)
        //     callFail()
        //     // throw new Error("Visual regression failed for : ", config.testName)
        //     // cy.log(testImage)
        //     // console.log(testResult)
        //   }
        //   logManager(config)
        // });
      } 
        
    });
  });

  //   if (!testResult) {
  //     cy.fail("Visual mismatch between baseline and test image");
  //   } else {
  //     cy.log("Visual regression passed!");
  //   }
});

function ssGenerator(el, config) {
  if (el.length !== 1) {
    cy.log(el[0]);
    throw new Error("Check your selector!");
  }
  //console.log(el[0].getBoundingClientRect());
  let elProps = el[0].getBoundingClientRect();
  let clipEl = {
    x: elProps.left,
    y: elProps.top,
    width: elProps.width,
    height: elProps.height,
  };
  // console.log(config);
  cy.wait(1000);
  if (!config.isTest || false) {
    cy.screenshot(config.baselineImagePath + config.baselineImageName, {
      capture: "viewport",
      clip: clipEl,
    });
    // el.screenshot(config.baselineImagePath + baselineImageName);
  } else {
    cy.task(
          "deleteFile",
          baseScreenshotRunDir() + config.testImagePath+ config.testImageName
        ).should("be.null");
    cy.screenshot(config.testImagePath + config.testImageName, {
      capture: "viewport",
      clip: clipEl,
    });
  }
}

function logManager(config) {
  if (Cypress.env("disableLogs")) {
    return cy._().then(() => {
      if (!config.resultName) {
        config.testImageName = "t- " + config.testName;
      }
      return config;
    });
  }
  let logFilename = config.logFilename;
  let exists;
  let logs;

  return cy
    .task("fileCheck", logFilename)
    .then((data) => {
      exists = data;
    })
    .then(() => {
      if (!exists) {
        return cy.task("fileSave", [logFilename, JSON.stringify({ 1: [] })]);
      }
    })
    .then(() => {
      return cy.task("fileRead", logFilename).then((data) => {
        logs = JSON.parse(data);
        var currentRunId = Math.max(...Object.keys(logs));

        if (checkForTest(config.testName, logs[currentRunId])) {
          currentRunId += 1;
          logs[currentRunId] = [];
        }
        if (!config.resultName) {
          config.testImageName = "t- " + config.testName + " " + currentRunId;

          config.currentRunId = currentRunId;
        } else {
          logs[currentRunId].push({
            testName: config.testName,
            baselineImageName: config.baselineImageName,
            testImageName: config.testImageName,
            resultName: config.resultName,
            status: config.status,
          });
          return cy.task("fileSave", [logFilename, JSON.stringify(logs)]);
        }
      });
    })
    .then(() => {
      return config;
    });
}

function checkForTest(testName, data) {
  var res = false;
  data.forEach((el) => {
    console.log(el);
    if (el["testName"] == testName) {
      res = true;
    }
  });
  // console.log("data", data, res)
  return res;
}
