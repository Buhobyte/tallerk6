// Creator: k6 Browser Recorder 0.6.2

import { sleep, group, check } from 'k6'
import http from 'k6/http'
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js'
// Consumir archivos CVS
import { SharedArray } from 'k6/data'; // 
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js' //

const csvData = new SharedArray('another data name', function () {
  // Load CSV file and parse it using Papa Parse
  return papaparse.parse(open('./data_usuarios.csv'), { header: true }).data;
});

// export const options = { vus: 1, duration: '5s' }
export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
    http_req_duration: ['avg<200'], // 95% of requests should be below 200ms
    iterations: ['rate<500'], // 95% of requests should be below 200ms
  },
};

// checks.........................: 100.00% ✓ 1        ✗ 0
// data_received..................: 10 kB   5.3 kB/s
// data_sent......................: 1.2 kB  652 B/s
// group_duration.................: avg=873.52ms min=873.52ms med=873.52ms max=873.52ms p(90)=873.52ms p(95)=873.52ms
// http_req_blocked...............: avg=243.58ms min=0s       med=243.58ms max=487.16ms p(90)=438.45ms p(95)=462.81ms
// http_req_connecting............: avg=94.65ms  min=0s       med=94.65ms  max=189.3ms  p(90)=170.37ms p(95)=179.83ms
// ✓ http_req_duration..............: avg=193.17ms min=191.5ms  med=193.17ms max=194.85ms p(90)=194.51ms p(95)=194.68ms
//   { expected_response:true }...: avg=193.17ms min=191.5ms  med=193.17ms max=194.85ms p(90)=194.51ms p(95)=194.68ms
// ✓ http_req_failed................: 0.00%   ✓ 0        ✗ 2

export default function main() {

  let response
  const Data_Users = new SharedArray('Data', function () {
    return papaparse.parse(open('./data_usuarios.csv'), { header: true }).data;
  });

  group('page_3 - https://petstore.octoperf.com/actions/Account.action', function () {
    response = http.post(
      'https://petstore.octoperf.com/actions/Account.action',
      {
        username: Data_Users.user,
        password: Data_Users.password,
        signon: 'Login',
        _sourcePage:
          '2RVrJ_T60JmGrJRTUeB_-j8esKAyZAeHAOosgkPZH2cSRJVLLMFJBTBFxxXx4106GMLzZ7uJbi_qMMoIhCeqB_S5gWtlLTRHpmGjtn0wRz4=',
        __fp: '0BD8OUxuKM5d7x4BLNBxkLj0FKI8fx4Bgu_gOkVi-u4GDX_AZjxxuVVoPk0gcnX9',
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

  // Automatically added sleep
  console.log(response.body)

  check(response, {
    'PV_texto': (r) => r.body.includes(`Welcome`)
  })
  sleep(randomIntBetween(1, 5))
}