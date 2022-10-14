// Creator: k6 Browser Recorder 0.6.2

import { sleep, group, check } from 'k6'
import http from 'k6/http'
import {randomIntBetween} from 'https://jslib.k6.io/k6-utils/1.2.0/index.js'
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { SharedArray } from 'k6/data';
import {findBetween} from 'https://jslib.k6.io/k6-utils/1.2.0/index.js'
//LLAMADO AL DATAPOOL


//export const options = { vus: 10, duration: '5m' }

const Data_Users = new SharedArray('Data', function () {
    return papaparse.parse(open('./data_usuarios.csv'), { header: true }).data;
  });
  
  /*
  for (const userPwdPair of Data_Users) {
    console.log(JSON.stringify(userPwdPair));
 }
*/

export const options = {
    stages:[
        {duration: '3s', target: 3},   //rampUp, tiempo que tarda en subir el total de usuarios configurado
        {duration: '10s', target: 3},  //etapa estable, tiempo de ejecución de la etapa estable
        {duration: '3s', target: 0} ,  //rampDown, tiempo en que se termine de bajar los usuarios
    ],

    thresholds: {
  
      http_req_failed: ['rate<0.01'], // http errors should be less than 1%
      http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
      http_req_duration: ['avg<2000'], // 95% of requests should be below 200ms
  
    },


  
  };


export default function main() {



  let response

  const randomUser = Data_Users[Math.floor(Math.random() * Data_Users.length)];
  console.log('Random user: ', JSON.stringify(randomUser.USERS));
  console.log('Random pass: ', JSON.stringify(randomUser.PASSWORDS));


  //

  //PV es para confirmar que la solicitud fue exitosa mas alla del codigo 200.

  group('page_3 - https://petstore.octoperf.com/actions/Account.action', function () {
    response = http.post(
      'https://petstore.octoperf.com/actions/Account.action',
      {
        username: randomUser.USERS,
        password: randomUser.PASSWORDS,
        signon: 'Login',
        _sourcePage:
          'GMigC1mG_uuKkwk9tr2Z5ea7Y_0sOJn0PYfEVk3ZyK_uGo_wi3VmrOp4yqk8atF58bca5IT3PLo7YZyRmPyVrVGvubWusMzQI-BKTMDcbMw=',
        __fp: '9-Uo-XHQtNNN2U8so_0sePuC7wbO7OHjhOXumFuymvzp9k1_nsi3dXsB7MgCGZaC',
      },
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          origin: 'https://petstore.octoperf.com',
          'upgrade-insecure-requests': '1',
          'sec-ch-ua': '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
  })

  console.log(response.body);

  const PV_Texto = findBetween(response.body, '<div id="WelcomeContent">', '</div>');

 check (response, {
    'PV de texto' : r => r.body.includes (PV_Texto)
    })

  // Automatically added sleep




  sleep(randomIntBetween(1,3));
}