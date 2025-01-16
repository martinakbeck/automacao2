import http from 'k6/http';
import { sleep } from 'k6';

//Workload
export const options = {
  stages: [
    { duration: '10s', target: 10}, //Ramp-up mais usuários que o averageLoad
    { duration: '20s', target: 10}, // Platôpor mais tempo que o averageLoad
    { duration: '5s', target: 0}, //Ramp-down pode ser o mesmo que o averageLoad
  ]
};

//Casos de testes
export default function() {
  http.get('https://test.k6.io'); //Entrando no endpoint
  sleep(1); //User thinking time
}
