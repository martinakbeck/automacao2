import http from 'k6/http';
import { group, check } from 'k6';

//Workload
export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'], //Http errors devem ser abaixo de 1%
    http_req_duration: ['p(95)<200'] //95% das requisições devem ser abaixo de 200 ms
  }
  /*cenarios: {
    cenario1: {
      executor: 'constant-arrival-rate',
      duration: '5s',
      preAllocatedVUs: 50,
      rate: 50,
      timeUnit: '1s'
    }
  }*/
  //vus: 5, //Executar X usuários virtuais simultâneos para smoke-tests é até +-5 (recomendação k6)
  //duration: '5s', //Durante X tempo para smoke-tests é de alguns segundos a poucos miutos (recomendação do k6)
};

//Casos de testes
export default function () {
  let valorToken, produtoID, componenteID
  const url = "http://165.227.93.41/lojinha/v2/"
  const respostaFaker = http.get('https://fakerapi.it/api/v1/users?faker=username,name,login.password');
  group('Login com credenciais válidas', () => {
    const respostaLogin = http.post(`${url}login`, JSON.stringify({
      usuarioLogin: "martina2024",
      usuarioSenha: "martina2024"
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    check(respostaLogin, {
      'Status code é igual a 200': r => r.status === 200
    })
    valorToken = respostaLogin.json('data.token')
  })
  group('Cadastrar usuário novo', () => {
    const respostaAdicionarNovoUsuario = http.post(`${url}usuarios`, JSON.stringify({
      usuarioNome: respostaFaker.json('data[0].name'),
      usuarioLogin: respostaFaker.json('data[0].username'),
      usuarioSenha: respostaFaker.json('data[0].password')
    }))
    check(respostaAdicionarNovoUsuario, {
      'Status code é igual a 201': r => r.status === 201
    })
  })
  group('Cadastrar produto', () => {
    const respostaCriarProduto = http.post(`${url}produtos`, JSON.stringify({
      produtoNome: "Teste de Performance",
      produtoValor: 2000,
      produtoCores: ["Preto", "Vermelho"],
      produtoUrlMock: "",
      componentes: [
        {
          componenteNome: "string",
          componenteQuantidade: 6
        }
      ]
    }), {
      headers: {
        'Content-Type': 'application/json',
        'token': valorToken
      }
    })
    check(respostaCriarProduto, {
      'Status code é igual a 201': r => r.status === 201
    })
    produtoID = respostaCriarProduto.json('data.produtoId')

  })
  group('Buscar produtos do usuários', () => {
    const respostaBuscarProdutos = http.get(`${url}produtos`, {
      headers: {
        'Content-Type': 'application/json',
        'token': valorToken
      }
    })
    check(respostaBuscarProdutos, {
      'Status code é igual a 200': r => r.status === 200
    })
  })
  group('Buscar um produto do usuário', () => {
    const respostaBuscarUmProduto = http.get(`${url}produtos/${produtoID}`, {
      headers: {
        'Content-Type': 'application/json',
        'token': valorToken
      }
    })
    check(respostaBuscarUmProduto, {
      'Status code é igual a 200': r => r.status === 200
    })
  })
  group('Alterar informações de um produto', () => {
    const respostaAlterarProduto = http.put(`${url}produtos/${produtoID}`, JSON.stringify({
      produtoNome: "Alteração teste performance",
      produtoValor: 8,
      produtoCores: ["Verde", "Branco"],
      produtoUrlMock: "",
      componentes: [
        {
          componenteNome: "Outro Teste",
          componenteQuantidade: 6
        }
      ]
    }), {
      headers: {
        'Content-Type': 'application/json',
        'token': valorToken
      }
    })
    check(respostaAlterarProduto, {
      'Status code é igual a 200': r => r.status === 200
    })
  })
  group('Adicionar um novo componente ao produto', () => {
    const respostaAdicionarComponente = http.post(`${url}produtos/${produtoID}/componentes`, JSON.stringify({
      componenteNome: "Adicionar Componente",
      componenteQuantidade: 7
    }), {
      headers: {
        'Content-Type': 'application/json',
        'token': valorToken
      }
    })
    check(respostaAdicionarComponente, {
      'Status code é igual a 201': r => r.status === 201
    })
    componenteID = respostaAdicionarComponente.json('data.componenteId')
  })
  group('Buscar dados dos componentes de um produto', () => {
    const respostaBuscarDadosComponente = http.get(`${url}produtos/${produtoID}/componentes`, {
      headers: {
        'Content-Type': 'application/json',
        'token': valorToken
      }
    })
    check(respostaBuscarDadosComponente, {
      'Status code é igual a 200': r => r.status === 200
    })
  })
  group('Buscar um do componentes de produto', () => {
    const respostaBuscarUmComponente = http.get(`${url}produtos/${produtoID}/componentes/${componenteID}`, {
      headers: {
        'Content-Type': 'application/json',
        'token': valorToken
      }
    })
    check(respostaBuscarUmComponente, {
      'Status code é igual a 200': r => r.status === 200
    })
  })
  group('Alterar informações de um componente de produto', () => {
    const respostaAlterarComponente = http.put(`${url}produtos/${produtoID}/componentes/${componenteID}`, JSON.stringify({
      componenteNome: "Alteração Componente",
      componenteQuantidade: 10
    }), {
      headers: {
        'Content-Type': 'application/json',
        'token': valorToken
      }
    })
    check(respostaAlterarComponente, {
      'Status code é igual a 200': r => r.status === 200
    })
  })
  group('Remover um componente', () => {
    const respostaRemoverComponente = http.del(`${url}produtos/${produtoID}/componentes/${componenteID}`, null, {
      headers: {
        'Content-Type': 'application/json',
        'token': valorToken
      }
    })
    check(respostaRemoverComponente, {
      'Status code é igual a 204': r => r.status === 204
    })
  })
  group('Remover um produto', () => {
    const respostaRemoverProduto = http.del(`${url}produtos/${produtoID}`, null, {
      headers: {
        'Content-Type': 'application/json',
        'token': valorToken
      }
    })
    check(respostaRemoverProduto, {
      'Status code é igual a 204': r => r.status === 204
    })
  })
  group('Deletar dados do usuário', () => {
    const respostaDeletarDados = http.del(`${url}dados`, null, {
      headers: {
        'Content-Type': 'application/json',
        'token': valorToken
      }
    })
    check(respostaDeletarDados, {
      'Status code é igual a 204': r => r.status === 204
    })
  })
}