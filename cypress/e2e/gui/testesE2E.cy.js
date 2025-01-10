const { faker } = require("@faker-js/faker");

const usuario = Cypress.env('username')
const senha = Cypress.env('password')

describe('Fluxo E2E', () => {
    beforeEach(() => {
        cy.login("martina2024", "martina2024")
        cy.url().should('include', '/produto')
    });
    it('Criar produto com sucesso', () => {
        cy.novoProduto('Banana', '2,50', 'Verde')

        cy.get(".toast").as('toastProduto')
        cy.get('@toastProduto')
            .should('be.visible')
            .contains('Produto adicionado com sucesso')
            .and('have.css', 'background-color', 'rgb(50, 50, 50)')
            .and('have.css', 'color', 'rgb(255, 255, 255)')
        cy.url().should('include', '/produto/editar/')

        cy.get('a[href="#novocomponente"]')
            .should('be.visible')
            .and('have.css', 'background-color', 'rgb(233, 30, 99)')

        cy.wait(4000)
        cy.novoComponente('Cacho', 5)

        cy.get(".toast").as('toastComponente')
        cy.get("@toastComponente")
            .should('be.visible')
            .contains('Componente de produto adicionado com sucesso')
            .and('have.css', 'background-color', 'rgb(50, 50, 50)')
            .and('have.css', 'color', 'rgb(255, 255, 255)')
        cy.get('.collection')
            .find('.collection-item')
            .last()
            .find('.title').should('include.text', 'Cacho')

        cy.get('.waves-effect').eq(1).click()

        cy.url().should('contains', '/produto')
        cy.get('.collection li')
            .last()
            .find('.title a')
            .should('include.text', 'Banana')
    });
});

describe('Fluxo de Produto', () => {
    beforeEach(() => {
        cy.login("martina2024", "martina2024")
        cy.url().should('include', '/produto')
    });
    it('Adicionar produto sem nenhuma informação', () => {
        cy.novoProduto(' ', ' ', ' ')

        cy.url().should('include', '/produto?error=produtoNome,%20produtoValor%20e%20produtoCores%20sÃ£o%20campos%20obrigatÃ³rios')
        cy.get('.toast')
            .should('be.visible')
            .and('have.text', 'Nome, valor e cores são campos obrigatórios')
            .and('have.css', 'background-color', 'rgb(50, 50, 50)')
            .and('have.css', 'color', 'rgb(255, 255, 255)')
    });
    it('Adicionar produto sem nome', () => {
        cy.novoProduto(' ', '7,0', 'Amarelo')

        cy.get('.toast')
            .should('be.visible')
            .and('have.text', 'Campo nome é obrigatório')
            .and('have.css', 'background-color', 'rgb(50, 50, 50)')
            .and('have.css', 'color', 'rgb(255, 255, 255)')
    });
    it('Adicionar produto com caractere especial', () => {
        cy.novoProduto('Maçã', '8,00', 'Vermelha')

        cy.get(':nth-child(4) > .grey')
        .should('be.visible')
        .and('have.css', 'background-color', 'rgb(158, 158, 158)')
        .and('have.css', 'color', 'rgb(255, 255, 255)')
        .click()

        cy.get('.collection li')
            .last()
            .find('.title a')
            .should('have.text', 'Maçã')
    });
    it('Adiciona produto sem valor', () => {
        cy.novoProduto('Maçã', ' ', 'Vermelha')

        cy.url().should('eq', '/produto/novo')
        cy.get('.toast')
            .should('be.visible')
            .and('have.text', 'O valor do produto deve estar entre R$ 0,01 e R$ 7.000,00')
            .and('have.css', 'background-color', 'rgb(50, 50, 50)')
            .and('have.css', 'color', 'rgb(255, 255, 255)')
    });
    it('Adicionar produto sem cor', () => {
        cy.novoProduto('Pimentão', '10,00', ' ')
        cy.get('.toast').should('have.text', 'Campo cores é obrigatório')
            .and('have.css', 'background-color', 'rgb(50, 50, 50)')
            .and('have.css', 'color', 'rgb(255, 255, 255)')

    });
    it('Alterar produto', () => {
        cy.novoProduto('Uva', '6,50', 'Verde')
        cy.editaProduto('Banana', '7,00', 'Prata')

        cy.get('button.btn').should('be.visible').click()

        cy.get('.toast')
            .should('be.visible')
            .and('have.text', 'Produto alterado com sucesso')
            .and('have.css', 'background-color', 'rgb(50, 50, 50)')
            .and('have.css', 'color', 'rgb(255, 255, 255)')
        cy.get('#produtonome').should('have.value', 'Banana')
        cy.get('#produtovalor').should('have.value', '7,00')
        cy.get('#produtocores').should('have.value', 'Prata')
    });
    it('Excluir produto', () => {
        cy.excluir()

        cy.get('.toast')
            .should('be.visible')
            .and('have.text', 'Produto removido com sucesso')
            .and('have.css', 'background-color', 'rgb(50, 50, 50)')
            .and('have.css', 'color', 'rgb(255, 255, 255)')
    });
});

describe('Fluxo de Componente', () => {
    beforeEach(() => {
        cy.login("martina2024", "martina2024")
        cy.url().should('include', '/produto')
        cy.novoProduto('Abacaxi', '8,00', 'Amarelo')
    });
    it('Adicionar componente sem informações', () => {
        cy.novoComponente(' ', ' ')

        cy.get('.toast')
            .should('be.visible')
            .and('have.text', 'Nome e quantidade são campos obrigatórios')
            .and('have.css', 'background-color', 'rgb(50, 50, 50)')
            .and('have.css', 'color', 'rgb(255, 255, 255)')
    });
    it('Adicionar componente sem nome', () => {
        cy.novoComponente(' ', 8)

        cy.get('.toast')
            .should('be.visible')
            .and('have.text', 'Nome é campo obrigatório')
            .and('have.css', 'background-color', 'rgb(50, 50, 50)')
            .and('have.css', 'color', 'rgb(255, 255, 255)')
    });
    it('Adicionar componente sem valor', () => {
        cy.novoComponente('Rei', ' ')
        cy.get('.toast')
            .should('have.text', 'A quantidade mínima para o componente não deve ser inferior a 1')
            .and('be.visible')
            .and('have.css', 'background-color', 'rgb(50, 50, 50)')
            .and('have.css', 'color', 'rgb(255, 255, 255)')

    });
    it('Adicionar componente com caractere especial', () => {
        cy.novoComponente('Romã', 6)

        cy.get('.collection-item')
            .last()
            .find('.title')
            .should('include.text', 'Romã')
    });
    it('Excluir componente cadastrado', () => {
        cy.novoComponente('Pacote', 5)
        cy.get('.collection')
            .find('.collection-item')
            .first()
            .find('.title')
            .click();

        cy.wait(4000)

        cy.excluir()

        cy.get('.toast')
            .should('be.visible')
            .and('have.text', 'Componente de produto removido com sucesso')
            .and('have.css', 'background-color', 'rgb(50, 50, 50)')
            .and('have.css', 'color', 'rgb(255, 255, 255)')
    });
});

describe('Verificação de particionamento', () => {
    beforeEach(() => {
        cy.login("martina2024", "martina2024")
        cy.url().should('include', '/produto')
    });
    it('Valor mínimo (0) no produto', () => {
        cy.novoProduto('Maçã', '0,00', 'Vermelha')

        cy.url().should('eq', '/produto/novo')
        cy.get('.toast')
            .should('be.visible')
            .and('have.text', 'O valor do produto deve estar entre R$ 0,01 e R$ 7.000,00')
            .and('have.css', 'background-color', 'rgb(50, 50, 50)')
            .and('have.css', 'color', 'rgb(255, 255, 255)')
    });
    it('Valor mínimo (0,01) no produto', () => {
        cy.novoProduto('Maçã', '0,01', 'Vermelha')

        cy.url().should('include', '/editar/')
        cy.get('.toast')
            .should('be.visible')
            .and('have.text', 'Produto adicionado com sucesso')
            .and('have.css', 'background-color', 'rgb(50, 50, 50)')
            .and('have.css', 'color', 'rgb(255, 255, 255)')
    });

    it('Valor máximo (7.000,00) no produto', () => {
        cy.novoProduto('Maçã', '7000,00', 'Vermelha')

        cy.url().should('include', '/editar/')
        cy.get('.toast')
            .should('be.visible')
            .and('have.text', 'Produto adicionado com sucesso')
            .and('have.css', 'background-color', 'rgb(50, 50, 50)')
            .and('have.css', 'color', 'rgb(255, 255, 255)')
    });
    it('Valor máximo (7.000,01) no produto', () => {
        cy.novoProduto('Maçã', '7.000,01', 'Vermelha')

        cy.url().should('eq', '/produto/novo')
        cy.get('.toast')
            .should('be.visible')
            .and('have.text', 'O valor do produto deve estar entre R$ 0,01 e R$ 7.000,00')
            .and('have.css', 'background-color', 'rgb(50, 50, 50)')
            .and('have.css', 'color', 'rgb(255, 255, 255)')
    });
    it('Quantidade mínima (0) do componente', () => {
        cy.novoProduto('Maçã', '7,0', 'Vermelha')
        cy.novoComponente('Pacote', '0')

        cy.get('.toast')
            .should('be.visible')
            .and('have.text', 'A quantidade mínima para o componente não deve ser inferior a 1')
            .and('have.css', 'background-color', 'rgb(50, 50, 50)')
            .and('have.css', 'color', 'rgb(255, 255, 255)')
    });
    it('Quantidade mínima (1) do componente', () => {
        cy.novoProduto('Maçã', '7,0', 'Vermelha')
        cy.novoComponente('Pacote', '1')

        cy.get('.toast')
            .should('be.visible')
            .and('have.text', 'Componente de produto adicionado com sucesso')
            .and('have.css', 'background-color', 'rgb(50, 50, 50)')
            .and('have.css', 'color', 'rgb(255, 255, 255)')
    });
    it('Quantidade máxima (9999) do componente', () => {
        cy.novoProduto('Maçã', '7,0', 'Vermelha')
        cy.novoComponente('Pacote', '9999')

        cy.get('.toast')
            .should('be.visible')
            .and('have.text', 'Componente de produto adicionado com sucesso')
            .and('have.css', 'background-color', 'rgb(50, 50, 50)')
            .and('have.css', 'color', 'rgb(255, 255, 255)')
    });
    it('Quantidade máxima (10000) do componente', () => {
        cy.novoProduto('Maçã', '7,0', 'Vermelha')
        cy.novoComponente('Pacote', '10000')

        cy.get('.toast')
            .should('be.visible')
            .and('have.text', 'A quantidade máxima para o componente não deve ser maior que 9999')
            .and('have.css', 'background-color', 'rgb(50, 50, 50)')
            .and('have.css', 'color', 'rgb(255, 255, 255)')
    });
});

describe('Login inválido', () => {
    it('Login com credenciais inválidas', () => {
        cy.login(faker.person.firstName(), faker.internet.password())

        cy.url().should('include', '/?error=Falha%20ao%20fazer%20o%20login')
        cy.get('.toast').as('toast')
        cy.get("@toast").contains('Falha ao fazer o login')
            .and('have.css', 'background-color', 'rgb(50, 50, 50)')
            .and('have.css', 'color', 'rgb(255, 255, 255)')
    });

    it('Login com credenciais em branco', () => {
        cy.visit("/")
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/')

        cy.get('#btn-entrar')
            .should('be.visible')
            .and('have.css', 'background-color', 'rgb(38, 166, 154)')
            .click()

        cy.get('.toast').as('toast')
        cy.get("@toast").contains('Falha ao fazer o login')
            .and('have.css', 'background-color', 'rgb(50, 50, 50)')
            .and('have.css', 'color', 'rgb(255, 255, 255)')
    });
});

describe('Sair do Sistema', () => {
    beforeEach(() => {
        cy.login("martina2024", "martina2024")
    });

    it('Sair do sistema na página Lista de Produtos', () => {
        cy.get('#nav-mobile > :nth-child(2) > a')
        .should('be.visible')
        .click()
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/')
    });
    it('Sair do sistema na página Adicionar Produto', () => {
        cy.get('.waves-effect')
            .should('be.visible')
            .and('have.css', 'background-color', 'rgb(38, 166, 154)')
            .click()
        cy.get('#nav-mobile > :nth-child(2) > a')
        .should('be.visible')
        .click()
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/')
    });
    it('Sair do sistema na página Editar Produto', () => {
        cy.novoProduto('Abacaxi', '15,00', 'Amarelo')
        cy.get('#nav-mobile > :nth-child(2) > a')
        .should('be.visible')
        .click()
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/')
    });
});

describe('Acessibilidades', () => {
    beforeEach(() => {
        cy.login("martina2024", "martina2024")
    });
    afterEach(() => {
        cy.pageAccessibility()
    });
    it('Lista de produto', () => {
    });
    it('Adicionar Produto', () => {
        cy.get('.waves-effect')
            .should('be.visible')
            .and('have.css', 'background-color', 'rgb(38, 166, 154)')
            .click()
    });
    it('Editar Produto', () => {
        cy.novoProduto('Abacaxi', '15,00', 'Amarelo')
        cy.novoComponente('Amarelo', 6)
    });

});

