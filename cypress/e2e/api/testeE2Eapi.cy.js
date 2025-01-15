const { faker } = require("@faker-js/faker");

let valorToken
let url = "http://165.227.93.41/lojinha/v2/"
let produtoId, produtoNome, produtoValor, produtoCores
let componenteId, componenteNome, componenteQuantidade
let fakerNome, fakerLogin, fakerSenha
let tokenInvalido = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c3VhcmlvaWQiOiIxODQyOCIsInVzdWFyaW9sb2dpbiI6Im1hcnRpbmEyMDI0IiwidXN1YXJpb25vbWUiOiJNYXJ0aW5hIn0.mD5SAis3mC-NXdbMaBnrvqd0Gr1TxX-vAY90HOqLiC"
let nomeMais100 = "Teste teste teste teste Teste teste teste teste Teste teste teste teste Teste teste teste teste teste"

const usuario = Cypress.env('LOGIN')
const senha = Cypress.env('SENHA')

describe('Fluxo login', () => {
    it('Login com credenciais válidas (200)', () => {
        cy.loginAPI(usuario, senha).then((response) => {
            expect(response.status).to.eq(200)

            expect(response.body).to.have.property("message", "Sucesso ao realizar o login")
            expect(response.body).to.have.property("error", "")
        })
    });
    it('Login com credenciais inválidas (401)', () => {
        cy.loginAPI(faker.internet.username, faker.internet.password).then((response) => {
            expect(response.status).to.eq(401)

            expect(response.body).to.have.property("mensage", "")
            expect(response.body).to.have.property("error", "Login inválido")
        })
    });
    it('Login com credenciais em branco (401)', () => {
        cy.loginAPI("", "").then((response) => {
            expect(response.status).to.eq(401)

            expect(response.body).to.have.property("mensage", "")
            expect(response.body).to.have.property("error", "Login inválido")
        })
    });
    it('Login com credenciais com usuario em branco (401)', () => {
        cy.loginAPI("", senha).then((response) => {
            expect(response.status).to.eq(401)

            expect(response.body).to.have.property("mensage", "")
            expect(response.body).to.have.property("error", "Login inválido")
        })
    });
    it('Login com credenciais com senha em branco (401)', () => {
        cy.loginAPI(usuario, "").then((response) => {
            expect(response.status).to.eq(401)

            expect(response.body).to.have.property("mensage", "")
            expect(response.body).to.have.property("error", "Login inválido")
        })
    });
    it('Login com credenciais null (401)', () => {
        cy.loginAPI(null, null).then((response) => {
            expect(response.status).to.eq(401)

            expect(response.body).to.have.property("mensage", "")
            expect(response.body).to.have.property("error", "Login inválido")
        })
    });
    it('Login com usuário null (401)', () => {
        cy.loginAPI(null, null).then((response) => {
            expect(response.status).to.eq(401)

            expect(response.body).to.have.property("mensage", "")
            expect(response.body).to.have.property("error", "Login inválido")
        })
    });
    it('Login com senha null (401)', () => {
        cy.loginAPI(null, null).then((response) => {
            expect(response.status).to.eq(401)

            expect(response.body).to.have.property("mensage", "")
            expect(response.body).to.have.property("error", "Login inválido")
        })
    });
});
describe('Fluxo de usuário', () => {
    before(() => {
        cy.loginAPI(usuario, senha).then((response) => {
            valorToken = response.body.data.token
        })
    });
    it('Adicionar um novo usuário (201)', () => {
        fakerNome = faker.person.firstName()
        fakerLogin = faker.internet.username()
        fakerSenha = faker.internet.password()
        cy.adicionarUsuarioAPI(fakerNome, fakerLogin, fakerSenha, url)
            .then((response) => {
                expect(response.status).to.eq(201)
                expect(response.body.data).to.have.property("usuarioLogin", fakerLogin)
                expect(response.body.data).to.have.property("usuarioNome", fakerNome)

                expect(response.body).to.have.property("message", "Usuário adicionado com sucesso")
                expect(response.body).to.have.property("error", "")
            })
    });
    it('Adicionar um novo usuário já existente (409)', () => {
        cy.adicionarUsuarioAPI("Martina", "martina2024", "martina2024", url, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eq(409)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "O usuário martina2024 já existe.")
        })
    });
    it('Adicionar usuário com campos null (400)', () => {
        cy.adicionarUsuarioAPI(null, null, null, url, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eq(400)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "usuarioNome, usuarioLogin e usuarioSenha são atributos obrigatórios")
        })
    });
    it('Adicionar usuário com usuário null (400)', () => {
        cy.adicionarUsuarioAPI(faker.person.firstName(), null, faker.internet.password(), url, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eq(400)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "usuarioNome, usuarioLogin e usuarioSenha são atributos obrigatórios")
        })
    });
    it('Adicionar usuário com senha null (400)', () => {
        cy.adicionarUsuarioAPI(faker.person.firstName, faker.internet.username, null, url, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eq(400)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "usuarioNome, usuarioLogin e usuarioSenha são atributos obrigatórios")
        })
    });
    it('Adicionar usuário com nome em branco (400)', () => {
        cy.adicionarUsuarioAPI("", faker.internet.username, faker.internet.password, url, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eq(400)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "usuarioNome, usuarioLogin e usuarioSenha são atributos obrigatórios")
        })
    });
    it('Adicionar usuário com login em branco (400)', () => {
        cy.adicionarUsuarioAPI(faker.person.firstName, "", faker.internet.password, url, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eq(400)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "usuarioNome, usuarioLogin e usuarioSenha são atributos obrigatórios")
        })
    });
    it('Adicionar usuário com senha em branco (400)', () => {
        cy.adicionarUsuarioAPI(faker.person.firstName, faker.internet.username, "", url, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eq(400)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "usuarioNome, usuarioLogin e usuarioSenha são atributos obrigatórios")
        })
    });
    it('Limpar dados com token válido (204)', () => {
        cy.limparDadosAPI(url, valorToken).then((response) => {
            expect(response.status).to.eq(204)

            expect(response.body).to.have.property("message", "Dados removidos com sucesso")
            expect(response.body).to.have.property("error", "")
        })
    });
    it('Limpar dados sem token (401)', () => {
        cy.limparDadosAPI(url, "").then((response) => {
            expect(response.status).to.eq(401)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "Não autorizado")
        })
    });
    it('Limpar dados com token null (401)', () => {
        cy.limparDadosAPI(url, null).then((response) => {
            expect(response.status).to.eq(401)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "Não autorizado")
        })
    });
    it('Limpar dados com token inválido (401)', () => {
        cy.limparDadosAPI(url, tokenInvalido).then((response) => {
            expect(response.status).to.eq(401)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "Não autorizado")
        })
    });
});
describe('Fluxo de Produto', () => {
    before(() => {
        cy.loginAPI(usuario, senha).then((response) => {
            valorToken = response.body.data.token
        })
    });
    after(() => {
        cy.limparDadosAPI(url, valorToken)
    })
    it('Adicionar produto com componente com caractere especial (201)', () => {
        cy.novoProdutoAPI(url, valorToken, "Maçã", 3.58, ["Amarelo", "Verde"], "Laço", 8).then((response) => {
            expect(response.status).to.eq(201)
            produtoId = response.body.data.produtoId
            produtoNome = response.body.data.produtoNome
            produtoValor = response.body.data.produtoValor
            produtoCores = response.body.data.produtoCores
            componenteId = response.body.data.componentes[0].componenteId
            componenteNome = response.body.data.componentes[0].componenteNome
            componenteQuantidade = response.body.data.componentes[0].componenteQuantidade

            expect(response.body.data).to.have.property("produtoId", produtoId).that.is.a("number")
            expect(response.body.data).to.have.property("produtoNome", produtoNome).that.is.a("string")
            expect(response.body.data).to.have.property("produtoValor", produtoValor).that.is.a("number")
            expect(response.body.data).to.have.property("produtoCores").that.deep.equal(produtoCores).that.is.a("Array")

            expect(response.body.data.componentes[0]).to.have.property("componenteId", componenteId).that.is.a("number")
            expect(response.body.data.componentes[0]).to.have.property("componenteNome", componenteNome).that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteQuantidade", componenteQuantidade).that.is.a("number")

            expect(response.body).to.have.property("message", "Produto adicionado com sucesso")
            expect(response.body).to.have.property("error", "")
        })

    });
    it('Adicionar produto com componente (201)', () => {
        cy.novoProdutoAPI(url, valorToken, "Banana", 3.58, ["Amarelo", "Verde"], "Cacho", 8).then((response) => {
            expect(response.status).to.eq(201)
            produtoId = response.body.data.produtoId
            produtoNome = response.body.data.produtoNome
            produtoValor = response.body.data.produtoValor
            produtoCores = response.body.data.produtoCores
            componenteId = response.body.data.componentes[0].componenteId
            componenteNome = response.body.data.componentes[0].componenteNome
            componenteQuantidade = response.body.data.componentes[0].componenteQuantidade

            expect(response.body.data).to.have.property("produtoId", produtoId).that.is.a("number")
            expect(response.body.data).to.have.property("produtoNome", produtoNome).that.is.a("string")
            expect(response.body.data).to.have.property("produtoValor", produtoValor).that.is.a("number")
            expect(response.body.data).to.have.property("produtoCores").that.deep.equal(produtoCores).that.is.a("Array")

            expect(response.body.data.componentes[0]).to.have.property("componenteId", componenteId).that.is.a("number")
            expect(response.body.data.componentes[0]).to.have.property("componenteNome", componenteNome).that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteQuantidade", componenteQuantidade).that.is.a("number")

            expect(response.body).to.have.property("message", "Produto adicionado com sucesso")
            expect(response.body).to.have.property("error", "")
        })

    });
    it('Adicionar produto com token inválido (401)', () => {
        cy.novoProdutoAPI(url, tokenInvalido, "Banana", 3.58, ["Amarelo", "Verde"], "Cacho", 8).then((response) => {
            expect(response.status).to.eq(401)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "Não autorizado")
        })
    });
    it('Adicionar produto com token null (401)', () => {
        cy.novoProdutoAPI(url, null, "Banana", 3.58, ["Amarelo", "Verde"], "Cacho", 8).then((response) => {
            expect(response.status).to.eq(401)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "Não autorizado")
        })
    });
    it('Adicionar produto sem token (401)', () => {
        cy.novoProdutoAPI(url, "", "Tomate", 5.98, "Vermelho", "Teste Componente", 6).then((response) => {
            expect(response.status).to.eq(401)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "Não autorizado")
        })
    });
    it('Adicionar produto com componente sem nome (422)', () => {
        cy.novoProdutoAPI(url, valorToken, "Banana", 3.58, ["Amarelo", "Verde"], null, 8).then((response) => {
            expect(response.status).to.eq(422)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "Campo componenteNome e componenteQuantidade obrigatórios")
        })

    });
    it('Adicionar produto com componente sem quantidade (422)', () => {
        cy.novoProdutoAPI(url, valorToken, "Banana", 3.58, ["Amarelo", "Verde"], "Cacho", null).then((response) => {
            expect(response.status).to.eq(422)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "A quantidade mínima para os componentes não devem ser inferiores a 1")
        })

    });
    it('Adicionar nome do produto com mais de 100 caracteres (422)', () => {
        cy.novoProdutoAPI(url, valorToken, nomeMais100, 5.98, ["Vermelho", "Verde"], "Teste Componente", 6)
            .then((response) => {

                expect(response.status).to.eq(422)


                expect(response.body).to.have.property("message", "")
                expect(response.body).to.have.property("error", "Produto pode ter até 100 caracteres")
            })
    });
    it('Adicionar somente produto sem nome (400)', () => {
        cy.novoProdutoAPI(url, valorToken, null, 5.98, ["Vermelho", "Verde"], "Teste Componente", 6)
            .then((response) => {
                expect(response.status).to.eq(400)

                expect(response.body).to.have.property("message", "")
                expect(response.body).to.have.property("error", "produtoNome, produtoValor e produtoCores são campos obrigatórios")
            })
    });
    it('Adicionar somente produto sem valor (400)', () => {
        cy.novoProdutoAPI(url, valorToken, "Tomate", null, ["Vermelho", "Verde"], "Teste Componente", 6)
            .then((response) => {
                expect(response.status).to.eq(400)

                expect(response.body).to.have.property("message", "")
                expect(response.body).to.have.property("error", "produtoNome, produtoValor e produtoCores são campos obrigatórios")


            })
    });
    it('Adicionar um produto sem cores (400)', () => {
        cy.novoProdutoAPI(url, valorToken, "Tomate", 5.98, null, "Teste Componente", 6)
            .then((response) => {
                expect(response.status).to.eq(400)

                expect(response.body).to.have.property("message", "")
                expect(response.body).to.have.property("error", "produtoNome, produtoValor e produtoCores são campos obrigatórios")
            })
    });
    it('Buscar produtos do usuário (200)', () => {
        cy.buscarProdutosAPI(url, valorToken).then((response) => {
            produtoNome = response.body.data[0].produtoNome
            produtoValor = response.body.data[0].produtoValor
            produtoCores = response.body.data[0].produtoCores
            expect(response.status).to.eq(200)
            expect(response.body.data[0]).to.have.property("produtoNome", produtoNome).that.is.a("string")
            expect(response.body.data[0]).to.have.property("produtoValor", produtoValor).that.is.a("number")
            expect(response.body.data[0]).to.have.property("produtoCores", produtoCores).that.is.a("Array")

            expect(response.body).to.have.property("message", "Listagem de produtos realizada com sucesso")
            expect(response.body).to.have.property("error", "")
        })
    });
    it('Buscar produtos do usuário com token inválido (401)', () => {
        cy.buscarProdutosAPI(url, tokenInvalido).then((response) => {
            expect(response.status).to.eq(401)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "Não autorizado")
        })
    });
    it('Buscar um dos produtos do usuário (200)', () => {
        cy.buscarUmProdutoAPI(url, valorToken, produtoId).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.data.produtoId).to.eq(produtoId).that.is.a('number')
            expect(response.body.data.produtoNome).to.eq(produtoNome).that.is.a('string')

            expect(response.body).to.have.property("message", "Detalhando dados do produto")
            expect(response.body).to.have.property("error", "")
        })
    });
    it('Buscar um dos produto inexistente (404)', () => {
        cy.buscarUmProdutoAPI(url, valorToken, null).then((response) => {
            expect(response.status).to.eq(404)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "Produto não encontrado")
        })
    });
    it('Buscar um dos produtos, mas passando null (404)', () => {
        cy.buscarUmProdutoAPI(url, valorToken, null).then((response) => {
            expect(response.status).to.eq(404)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "Produto não encontrado")
        })
    });
    it('Buscar um dos produtos com token inválido (401)', () => {
        cy.buscarUmProdutoAPI(url, tokenInvalido, produtoId).then((response) => {
            expect(response.status).to.eq(401)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "Produto não encontrado")
        })
    });
    it('Alterar informações de um produto (200)', () => {
        cy.editarProdutoAPI(url, valorToken, "Tangerina", 8.58, ["Verde", "Laranja"], produtoId)
            .then((response) => {
                produtoId = response.body.data.produtoId
                produtoNome = response.body.data.produtoNome
                produtoValor = response.body.data.produtoValor
                produtoCores = response.body.data.produtoCores

                expect(response.status).to.eq(200)
                expect(response.body.data).to.have.property("produtoId", produtoId).that.is.a("number")
                expect(response.body.data).to.have.property("produtoNome", produtoNome).that.is.a("string")
                expect(response.body.data).to.have.property("produtoValor", produtoValor).that.is.a("number")
                expect(response.body.data).to.have.property("produtoCores").that.deep.equal("Verde,Laranja").that.is.a("string")

                expect(response.body).to.have.property("message", "Produto alterado com sucesso")
                expect(response.body).to.have.property("error", "")

            })
    });
    it('Alterar informações de um produto com código inválido (404)', () => {
        cy.editarProdutoAPI(url, valorToken, "Tangerina", 8.58, ["Verde", "Laranja"], 111111)
            .then((response) => {
                expect(response.status).to.eq(404)

                expect(response.body).to.have.property("message", "")
                expect(response.body).to.have.property("error", "Produto não encontrado")
            })
    });
    it('Alterar informações de um produto com token inválido (401)', () => {
        cy.editarProdutoAPI(url, tokenInvalido, "Tangerina", 8.58, ["Verde", "Laranja"], produtoId)
            .then((response) => {
                expect(response.status).to.eq(401)

                expect(response.body).to.have.property("message", "")
                expect(response.body).to.have.property("error", "Não autorizado")

            })
    });
    it('Alterar produto para nome null (400)', () => {
        cy.editarProdutoAPI(url, valorToken, null, 8.58, ["Verde", "Laranja"], produtoId)
            .then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body).to.have.property("message", "")
                expect(response.body).to.have.property("error", "produtoNome, produtoValor e produtoCores são campos obrigatórios")

            })
    });
    it('Alterar produto para sem nome (400)', () => {
        cy.editarProdutoAPI(url, valorToken, "", 8.58, ["Verde", "Laranja"], produtoId)
            .then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body).to.have.property("message", "")
                expect(response.body).to.have.property("error", "produtoNome, produtoValor e produtoCores são campos obrigatórios")

            })
    });
    it('Alterar produto para sem cores (400)', () => {
        cy.editarProdutoAPI(url, valorToken, "Limão", 8.58, null, produtoId)
            .then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body).to.have.property("message", "")
                expect(response.body).to.have.property("error", "produtoNome, produtoValor e produtoCores são campos obrigatórios")

            })
    });
    it("Remover um produto (204)", () => {
        cy.deletarProdutoAPI(url, valorToken, produtoId).then((response) => {
            expect(response.status).to.eq(204)

            expect(response.body).to.have.property("message", "Produto removido com sucesso")
            expect(response.body).to.have.property("error", "")
        })
    });
    it("Remover um produto inválido (404)", () => {
        cy.deletarProdutoAPI(url, valorToken, null).then((response) => {
            expect(response.status).to.eq(404)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "Produto não encontrado")
        })
    });
    it("Remover um produto com token inválido (401)", () => {
        cy.deletarProdutoAPI(url, tokenInvalido, produtoId).then((response) => {
            expect(response.status).to.eq(401)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "Não autorizado")
        })
    });
});
describe('Fluxo de Componentes', () => {
    before(() => {
        cy.loginAPI(usuario, senha).then((response) => {
            valorToken = response.body.data.token
        })
        cy.novoProdutoAPI(url, valorToken, "Ameixa", 15.50, ["Vermelha", "Preta"], "Teste Componente", 6).then((response) => {
            produtoId = response.body.data.produtoId
            componenteId = response.body.data.componentes[0].componenteId
            componenteNome = response.body.data.componentes[0].componenteNome
            componenteQuantidade = response.body.data.componentes[0].componenteQuantidade
        })
    })
    after(() => {
        cy.limparDadosAPI(url, valorToken).then((response) => {
            expect(response.status).to.eq(204)

            expect(response.body).to.have.property("message", "Dados do usuário apagados")
            expect(response.body).to.have.property("error", "")
        })
    })
    it('Adicionar um novo componente ao produto (201)', () => {
        cy.novoComponenteAPI(url, valorToken, "Bandeja", 6, produtoId).then((response) => {
            componenteId = response.body.data.componenteId
            componenteNome = response.body.data.componenteNome
            componenteQuantidade = response.body.data.componenteQuantidade

            expect(response.status).to.eq(201)
            expect(response.body.data).to.have.property("componenteId", componenteId).that.is.a("number")
            expect(response.body.data).to.have.property("componenteNome", componenteNome).that.is.a("string")
            expect(response.body.data).to.have.property("componenteQuantidade", componenteQuantidade).that.is.a("number")

            expect(response.body).to.have.property("message", "Componente de produto adicionado com sucesso")
            expect(response.body).to.have.property("error", "")
        })

    });
    it('Adicionar um novo componente ao produto com caractere especial (201)', () => {
        cy.novoComponenteAPI(url, valorToken, "Laço", 6, produtoId).then((response) => {
            componenteId = response.body.data.componenteId
            componenteNome = response.body.data.componenteNome
            componenteQuantidade = response.body.data.componenteQuantidade

            expect(response.status).to.eq(201)
            expect(response.body.data).to.have.property("componenteId", componenteId).that.is.a("number")
            expect(response.body.data).to.have.property("componenteNome", componenteNome).that.is.a("string")
            expect(response.body.data).to.have.property("componenteQuantidade", componenteQuantidade).that.is.a("number")

            expect(response.body).to.have.property("message", "Componente de produto adicionado com sucesso")
            expect(response.body).to.have.property("error", "")
        })

    });
    it('Adicionar um novo componente ao produto sem nome (400)', () => {
        cy.novoComponenteAPI(url, valorToken, "", 6, produtoId).then((response) => {
            expect(response.status).to.eq(400)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "componenteNome e componenteQuantidade são atributos obrigatórios")
        })
    });
    it('Adicionar um novo componente ao produto sem quantidade (400)', () => {
        cy.novoComponenteAPI(url, valorToken, "Pacote", null, produtoId).then((response) => {
            expect(response.status).to.eq(400)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "componenteNome e componenteQuantidade são atributos obrigatórios")
        })
    });
    it('Buscar dados dos componentes de um produto (200)', () => {
        cy.buscarComponentesAPI(url, valorToken, produtoId).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.data[2]).to.have.property("componenteId", componenteId).that.is.a("number")
            expect(response.body.data[2]).to.have.property("componenteNome", componenteNome).that.is.a("string")
            expect(response.body.data[2]).to.have.property("componenteQuantidade", componenteQuantidade).that.is.a("number")

            expect(response.body).to.have.property("message", "Listagem de componentes de produto realizada com sucesso")
            expect(response.body).to.have.property("error", "")
        })
    });
    it('Buscar um componente de produto (200)', () => {
        cy.buscarUmComponenteAPI(url, valorToken, produtoId, componenteId).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.data).to.have.property("componenteId", componenteId).that.is.a("number")
            expect(response.body.data).to.have.property("componenteNome", componenteNome).that.is.a("string")
            expect(response.body.data).to.have.property("componenteQuantidade", componenteQuantidade).that.is.a("number")

            expect(response.body).to.have.property("message", "Detalhando dados do componente de produto")
            expect(response.body).to.have.property("error", "")
        })
    });
    it('Buscar um componente de produto inexistente (404)', () => {
        cy.buscarUmComponenteAPI(url, valorToken, 111111, componenteId).then((response) => {
            expect(response.status).to.eq(404)
            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "Produto não encontrado")
        })
    });
    it('Buscar um componente inexistente de produto (404)', () => {
        cy.buscarUmComponenteAPI(url, valorToken, produtoId, 111111).then((response) => {
            expect(response.status).to.eq(404)
            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "Componente não encontrado")
        })
    });
    it('Alterar informações de um componente de produto (200)', () => {
        cy.editarUmComponenteAPI(url, valorToken, produtoId, componenteId, "Alteraração componente", 8).then((response) => {
            componenteId = response.body.data.componenteId
            componenteNome = response.body.data.componenteNome
            componenteQuantidade = response.body.data.componenteQuantidade

            expect(response.body.data).to.have.property("componenteId", componenteId).that.is.a("number")
            expect(response.body.data).to.have.property("componenteNome", componenteNome).that.is.a("string")
            expect(response.body.data).to.have.property("componenteQuantidade", componenteQuantidade).that.is.a("number")
            expect(response.status).to.eq(200)

            expect(response.body).to.have.property("message", "Componente de produto alterado com sucesso")
            expect(response.body).to.have.property("error", "")
        })
    });
    it('Alterar informações de um componente inexistente (404)', () => {
        cy.editarUmComponenteAPI(url, valorToken, produtoId, 111111, "Alteraração componente", 8).then((response) => {
            expect(response.status).to.eq(404)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "Componente não encontrado")
        })
    });
    it('Alterar informações de um componente de produto inexistente (404)', () => {
        cy.editarUmComponenteAPI(url, valorToken, 111111, componenteId, "Alteraração componente", 8).then((response) => {
            expect(response.status).to.eq(404)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "Produto não encontrado")
        })
    });
    it('Remover um componente do produto (204)', () => {
        cy.excluirUmComponenteAPI(url, valorToken, produtoId, componenteId).then((response) => {
            expect(response.status).to.eq(204)

            expect(response.body).to.have.property("message", "Componente removido com sucesso")
            expect(response.body).to.have.property("error", "")
        })
    });
    it('Remover um componente inexistente do produto (404)', () => {
        cy.excluirUmComponenteAPI(url, valorToken, produtoId, 111111).then((response) => {
            expect(response.status).to.eq(404)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "Componente não encontrado")
        })
    });
    it('Remover um componente do produto inexistente (404)', () => {
        cy.excluirUmComponenteAPI(url, valorToken, 111111, componenteId).then((response) => {
            expect(response.status).to.eq(404)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "Produto não encontrado")
        })
    });
    it('Remover um componente do produto com token inválido (401)', () => {
        cy.excluirUmComponenteAPI(url, tokenInvalido, produtoId, componenteId).then((response) => {
            expect(response.status).to.eq(401)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "Não autorizado")
        })
    });
    it('Remover um componente do produto sem token (401)', () => {
        cy.excluirUmComponenteAPI(url, null, produtoId, componenteId).then((response) => {
            expect(response.status).to.eq(401)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "Não autorizado")
        })
    });
});
describe('Verificação de particionamento', () => {
    before(() => {
        cy.loginAPI(usuario, senha).then((response) => {
            valorToken = response.body.data.token
        })
    });
    after(() => {
        cy.limparDadosAPI(url, valorToken)
    })

    it('Adicionar produto com valor negativo (422)', () => {
        cy.novoProdutoAPI(url, valorToken, "Teste Particionamento", 0, ["Amarelo"], "Novo Componente", 5).then((response) => {
            expect(response.status).to.eq(422)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "O valor do produto deve estar entre R$ 0,01 e R$ 7.000,00")
        })
    });
    it('Adicionar produto com valor 0,00 (422)', () => {
        cy.novoProdutoAPI(url, valorToken, "Teste Particionamento", -6, ["Amarelo"], "Novo Componente", 5).then((response) => {
            expect(response.status).to.eq(422)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "O valor do produto deve estar entre R$ 0,01 e R$ 7.000,00")
        })
    });
    it('Adicionar produto com valor 0,01 (201)', () => {
        cy.novoProdutoAPI(url, valorToken, "Teste Particionamento", 0.01, ["Amarelo"], "Novo Componente", 5).then((response) => {
            expect(response.status).to.eq(201)

            expect(response.body).to.have.property("message", "Produto adicionado com sucesso")
            expect(response.body).to.have.property("error", "")
        })
    });
    it('Adicionar produto com valor 7.000,00 (201)', () => {
        cy.novoProdutoAPI(url, valorToken, "Teste Particionamento", 7000.00, ["Amarelo"], "Novo Componente", 5).then((response) => {
            expect(response.status).to.eq(201)

            expect(response.body).to.have.property("message", "Produto adicionado com sucesso")
            expect(response.body).to.have.property("error", "")
        })
    });
    it('Adicionar produto com valor 7.000,01 (422)', () => {
        cy.novoProdutoAPI(url, valorToken, "Teste Particionamento", 7000.01, ["Amarelo"], "Novo Componente", 5).then((response) => {
            expect(response.status).to.eq(422)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "O valor do produto deve estar entre R$ 0,01 e R$ 7.000,00")
        })
    });
    it('Quantidade mínima (0) do componente (422)', () => {
        cy.novoProdutoAPI(url, valorToken, "Teste Particionamento", 3.00, ["Amarelo"], "Novo Componente", 0).then((response) => {
            expect(response.status).to.eq(422)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "A quantidade mínima para os componentes não devem ser inferiores a 1")
        })
    });
    it('Quantidade negativa do componente (422)', () => {
        cy.novoProdutoAPI(url, valorToken, "Teste Particionamento", 3.00, ["Amarelo"], "Novo Componente", -2).then((response) => {
            expect(response.status).to.eq(422)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "A quantidade mínima para os componentes não devem ser inferiores a 1")
        })
    });
    it('Quantidade decimal do componente (422)', () => {
        cy.novoProdutoAPI(url, valorToken, "Teste Particionamento", 3.00, ["Amarelo"], "Novo Componente", 2.8).then((response) => {
            expect(response.status).to.eq(422)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "A quantidade mínima para os componentes não devem ser inferiores a 1")
        })
    });
    it('Quantidade mínima (1) do componente (201)', () => {
        cy.novoProdutoAPI(url, valorToken, "Teste Particionamento", 3.00, ["Amarelo"], "Novo Componente", 1).then((response) => {
            expect(response.status).to.eq(201)

            expect(response.body).to.have.property("message", "Produto adicionado com sucesso")
            expect(response.body).to.have.property("error", "")
        })
    });
    it('Quantidade máxima (99999) do componente (201)', () => {
        cy.novoProdutoAPI(url, valorToken, "Teste Particionamento", 3.00, ["Amarelo"], "Novo Componente", 99999).then((response) => {
            expect(response.status).to.eq(201)

            expect(response.body).to.have.property("message", "Produto adicionado com sucesso")
            expect(response.body).to.have.property("error", "")
        })
    });
    it('Quantidade máxima (100000) do componente (422)', () => {
        cy.novoProdutoAPI(url, valorToken, "Teste Particionamento", 3.00, ["Amarelo"], "Novo Componente", 100000).then((response) => {
            expect(response.status).to.eq(422)

            expect(response.body).to.have.property("message", "")
            expect(response.body).to.have.property("error", "A quantidade mínima para os componentes não devem ser superior a 99999")
        })
    });
});

