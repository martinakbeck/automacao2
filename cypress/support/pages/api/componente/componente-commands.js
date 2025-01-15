Cypress.Commands.add("novoComponenteAPI", (url, valorToken, nome, quantidade, produtoId) => {

    cy.api({
        method: "POST",
        url: `${url}produtos/${produtoId}/componentes`,
        headers: {
            token: valorToken
        },
        body: {
            componenteNome: nome,
            componenteQuantidade: quantidade
        },
        failOnStatusCode: false
    });

});

Cypress.Commands.add("buscarComponentesAPI", (url, valorToken, produtoId)=>{
    cy.api({
        method: "GET",
        url: `${url}produtos/${produtoId}/componentes`,
        headers: {
            token: valorToken
        },
        failOnStatusCode: false
    })

})

Cypress.Commands.add("buscarUmComponenteAPI", (url, valorToken, produtoId, componenteId)=>{
    cy.api({
        method: "GET",
        url: `${url}produtos/${produtoId}/componentes/${componenteId}`,
        headers: {
            token: valorToken
        },
        failOnStatusCode: false
    })

})

Cypress.Commands.add("editarUmComponenteAPI", (url, valorToken, produtoId, componenteId, nomeComponente, quantidadeComponente) =>{
    cy.api({
        method: "PUT",
        url: `${url}produtos/${produtoId}/componentes/${componenteId}`,
        headers: {
            token: valorToken
        },
        body: {
            componenteNome: nomeComponente,
            componenteQuantidade:quantidadeComponente
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add("excluirUmComponenteAPI", (url, valorToken, produtoId, componenteId) => {
    cy.api({
        method: "DELETE",
        url: `${url}produtos/${produtoId}/componentes/${componenteId}`,
        headers: {
            token: valorToken
        },
        failOnStatusCode: false
    })
})

