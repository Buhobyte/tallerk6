import http from 'k6/http'  //-- esto nos va a traer todas las funcionalidades para poder consumir endpoint 
import {sleep, check} from 'k6'  //nos permitira configurar thinktimes y puntos de verificación
import {randomIntBetween} from 'https://jslib.k6.io/k6-utils/1.2.0/index.js'   //nos permite configurar numeros aleatorios entre rangos, principalmente para ayudar a tener un rampup menos agresivo
import {findBetween} from 'https://jslib.k6.io/k6-utils/1.2.0/index.js'  //extraer un texto de la respuesta basado en su posición antes y despues


export let options = {
        stages:[
            {duration: '3s', target: 3},   //rampUp, tiempo que tarda en subir el total de usuarios configurado
            {duration: '10s', target: 3},  //etapa estable, tiempo de ejecución de la etapa estable
            {duration: '3s', target: 0} ,  //rampDown, tiempo en que se termine de bajar los usuarios
        ]

    }


export default function() {

    const url = 'https://reqres.in';
    const meth = '/api/users?page=';


    for (let i = 1; i <= 3; i++){
        let response = http.get(url+meth+i);
        sleep(randomIntBetween(1,3));

        const correo = findBetween(response.body, '"email":"', '","first_name"');

        console.log(correo);

//        console.log(response);                      //imprimir el cuerpo de envio
        console.log(response.body);                 //imprimir el cuerpo de la respuesta
        console.log(response.status);               //imprimir el estatus e la respuesta

        check (response, {
            'codigo respuesta http': r => r.status == 200,                  //punto de verificación de codigo de respuesta
            'PV de texto' : r => r.body.includes ('"email":"george.bluth@reqres.in"')   //punto de verificación de texto de la respuesta
        }
        
        
        )
    }
    
}