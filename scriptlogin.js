// --Librerías
import http from 'k6/http'; //nos trae todas las funcionalidades para poder consumir http
import { sleep, check } from 'k6'; //nos permite configurar thinkitimes y puntos de verificación
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js'; //
import { findBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js'

// Consumir archivos CVS
import { SharedArray } from 'k6/data'; // 
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js' //

//Comandos
// k6 run script.js
// k6 login cloud --token 5feb21237fb6d3ae9efe05af0752f9e0b7fbf958993d6df2b08bbdc3b57d6287
// k6 run --out cloud script.js


const url = 'https://reqres.in/api/login'
const body = {
    "email": "eve.holt@reqres.in",
    "password": "cityslicka"
}

export default function () {
    let res_login = http.post(url,JSON.stringify(body), {headers: {'Content-Type': 'application/json'}});


    console.log(res_login)
    console.log(res_login.body)
    console.log(res_login.status)

    const token = findBetween(res_login.body,'"token":"','"}')
    console.log(token)
}