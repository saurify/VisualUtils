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


import testImage from "./utils";

const defaultConfig = {
  isTest: true,
  threshold: 0.1,
  alpha: 0.1,
  baselineImagePath: "images/baselineImages/",
  testImagePath: "images/testImages/",
  resultImagePath: "images/results/",
  testName: "testName.png",
  baselineImageName: "b- testName",
  testImageName: "t- testName",
  rootDir: "cypress/screenshots/",
  extension: ".png",
  blackout : []
};
//config should contain {testName: name, isTest:true, }
Cypress.Commands.add("visualTest", (el, config) => {
  config = Object.assign({}, defaultConfig, config);
  let testResult = false;
  config.baselineImageName = "b- " + config.testName;
  config.testImageName = "t- " + config.testName;
  //   console.log(config)
  config.blackout.forEach(blackoutSelector => {
    cy.get(blackoutSelector).invoke('hide')
    
  });
  cy.get(selector).then(($el) => {
    ssGenerator($el, config);
    if (config.isTest) {
      testResult = testImage(config);
      console.log(testResult);
    }
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
      clip: {
        x: elProps.left,
        y: elProps.top,
        width: elProps.width,
        height: elProps.height,
      },
    });
    // el.screenshot(config.baselineImagePath + baselineImageName);
  } else {
    cy.screenshot(config.testImagePath + config.testImageName, {
      capture: "viewport",
      clip: {
        x: elProps.left,
        y: elProps.top,
        width: elProps.width,
        height: elProps.height,
      },
    });
  }
}
