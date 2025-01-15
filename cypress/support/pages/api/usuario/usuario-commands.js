let url = "http://165.227.93.41/lojinha/v2/"

Cypress.Commands.add("loginAPI", (usuario, senha) => {
    cy.api({
        method: "POST",
        url: `${url}login`,
        body: {
            "usuarioLogin": usuario,
            "usuarioSenha": senha
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add("adicionarUsuarioAPI", (nome, login, senha, url) => {
    cy.api({
        method: "POST",
        url: `${url}usuarios`,
        body: {
            "usuarioNome": nome,
            "usuarioLogin": login,
            "usuarioSenha": senha
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add("limparDadosAPI", (url, valorToken) => {
    cy.api({
        method: "DELETE",
        url: `${url}dados`,
        headers: {
            token: valorToken
        },
        failOnStatusCode: false
    })
})