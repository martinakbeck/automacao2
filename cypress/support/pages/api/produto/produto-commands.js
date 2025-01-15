Cypress.Commands.add("novoProdutoAPI", (url, valorToken, nomeProduto, valor, cores, nomeComponente, quantidadeComponente) => {
    cy.api({
        method: "POST",
        url: `${url}produtos`,
        headers: {
            token: valorToken
        },
        body: {
            "produtoNome": nomeProduto,
            "produtoValor": valor,
            "produtoCores": cores,
            "produtoUrlMock": "",
            "componentes": [
                {
                    "componenteNome": nomeComponente,
                    "componenteQuantidade": quantidadeComponente
                }
            ]
        },
        failOnStatusCode: false
    });
});

Cypress.Commands.add("editarProdutoAPI", (url, valorToken, nome, valor, cores, produtoId) => {
    cy.api({
        method: "PUT",
        url: `${url}produtos/${produtoId}`,
        headers: {
            token: valorToken
        },
        body: {
            "produtoNome": nome,
            "produtoValor": valor,
            "produtoCores": cores
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add("buscarProdutosAPI", (url, valorToken) => {
    cy.api({
        method: "GET",
        url: `${url}produtos`,
        headers: {
            token: valorToken
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add("buscarUmProdutoAPI", (url, valorToken, produtoId) => {
    cy.api({
        method: "GET",
        url: `${url}produtos/${produtoId}`,
        headers: {
            token: valorToken
        },
        body: {
            produtoId: produtoId
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add("deletarProdutoAPI", (url, valorToken, produtoId)=>{
    cy.api({
        method: "DELETE",
        url: `${url}produtos/${produtoId}`,
        headers: {
            token: valorToken
        },
        failOnStatusCode: false
    })
})