Cypress.Commands.add('excluir', () => {
    cy.get('.collection')
        .find('.collection-item') 
        .first()  
        .find('.secondary-content')
        .should('be.visible')
        .and('have.css', 'color', 'rgb(38, 166, 154)')
        .click()
        
}) 