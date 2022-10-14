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


// export const options ={
//     stages:[
//         {target:10,duration:'30s'}, // ram up
//         {target: 10, duration: '3m'}, // etapa estable pruebas de carga estandar (30min)
//         {target: 40, duration: '15s'}, // ramp down
//         {target: 40, duration: '40s'}, // ramp down
//         {target: 5, duration: '5s'}, // ramp down
//         {target: 5, duration: '1m'}, // ramp down
//         {target: 0, duration: '5s'}, // ramp down
//     ]
// }

export default function () {
    let resp = http.get("https://reqres.in/api/users?page=1");

    // console.log(resp); // imprimit tanto solicitud como códio de respuesta
    console.log(resp.body); // imprimir bodyOut
    // console.log(resp.status); //imprime el código http devuelto

    sleep(randomIntBetween(1, 30)); // simular un tiempo de espera (tiempo muerto) que el usuario se demorar en reenviar la petición
    // Siempre configurar un punto de validación de texto
    check(resp, {
        'Codigo 200': (r) => r.status === 200,
        'PV_texto': (r) => r.body.includes(`"id":2,"email"`)
    })
    const correo_id2 = findBetween(resp.body,`"id":1,"email":"`,`","first_name"`)
    console.log(correo_id2)
}