describe('Single test', () => {
  it('passes', () => {
    cy.visit('https://www.reddit.com/r/india/comments/17u7wt6/i_applied_for_a_job_through_a_placement_company/')
    cy.get('#post-title-t3_17u7wt6').then(($el)=>{
      cy.visualTest($el, {testName: "demo", isTest:true})
    })
    cy.visualtest
  })
})