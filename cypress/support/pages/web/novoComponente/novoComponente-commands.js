Cypress.Commands.add('novoComponente', (nome, quantidade) => {
    cy.url().should('contains', '/produto/editar/')
    cy.get('.waves-effect.waves-light.btn.right.pink.modal-trigger')
        .should('be.visible')
        .and('have.css', 'background-color', 'rgb(233, 30, 99)')
        .click()
    cy.get('.modal').should('be.visible');
    cy.get('#componentenomeadicionar').should('be.visible').type(nome)
    cy.get('#componentequantidadeadicionar').should('be.visible').type(quantidade)
    cy.get('a[onclick="adicionarComponente()"]')
        .should('be.visible')
        .and('have.css', 'background-color', 'rgb(38, 166, 154)')
        .click()
})