describe('Single test', () => {
  it('passes', () => {
    cy.visit("www.google.com")
    //write your tests

    //ideally you'd want to do visual regression as a separte test, but if you want to execute it with test flow, add it in same test.

    // config can include a list of selectors of elements which you want to blackout from visual comparison 

    //example use
    cy.visualTest(".ikrT4e", { isTest: true, testName: "google search bar" })
    cy.visualTest(".lnXdpd", { isTest: true, testName: "google logo" })

  })
})