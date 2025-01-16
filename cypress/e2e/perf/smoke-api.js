import http from 'k6/http';
import { sleep } from 'k6';

//Workload
export const options = {
  vus: 5, //Executar X usuários virtuais simultâneos para smoke-tests é até +-5 (recomendação k6)
  duration: '30s', //Durante X tempo para smoke-tests é de alguns segundos a poucos miutos (recomendação do k6)
};

//Casos de testes
export default function() {
  http.get('https://test.k6.io'); //Entrando no endpoint
  sleep(1); //User thinking time
}
