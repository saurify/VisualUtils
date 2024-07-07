// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import { defaultConfig } from "./commands";
before(() => {
  //only deleting these two because deleting screenshots folder complteley complicates to handle headless mode and gui mode
  cy.task("folderRemove", "./cypress/" + defaultConfig.testImagePath).should(
    "be.null"
  );
  cy.task("folderRemove", "./cypress/" + defaultConfig.resultImagePath).should(
    "be.null"
  );
  cy.task("folderRemove",  `${Cypress.config().screenshotsFolder}/${Cypress.spec.name}/`).should("be.null");
});

// Alternatively you can use CommonJS syntax:
// require('./commands')
