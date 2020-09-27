import Server from './classes/server';
import router from './routes/router';
import bodyParser from 'body-parser';
import cors from 'cors';


// test pilas
import { Cola } from './classes/contenedores';
import { Pila } from './classes/contenedores';
import { Ticket } from './classes/ticket';
const pila = new Pila<Ticket>();

pila.mete(new Ticket(pila.length().toString()));
pila.mete(new Ticket(pila.length().toString()));
pila.mete(new Ticket(pila.length().toString()));
pila.mete(new Ticket(pila.length().toString()));
pila.mete(new Ticket(pila.length().toString()));

console.log(pila.saca ());
pila.mete(new Ticket('a'));
pila.mete(new Ticket('b'));
console.log(pila.saca ());

console.log(JSON.stringify(pila.lee(5)));

console.log(pila.saca ());
console.log(JSON.stringify(pila.lee(5)));
console.log(pila.saca ());
console.log(pila.lee(5));
console.log(pila.saca ());
console.log(pila.saca ());
console.log(pila.saca ());
console.log(pila.saca ());
console.log(pila.saca ());
console.log(pila.saca ());


pila.mete(new Ticket('c'));;
pila.mete(new Ticket('d'));
console.log(pila.saca ());
console.log(pila.saca ());
console.log(JSON.stringify(pila.lee(5)));


// test pilas

const server = Server.instance;

// BodyParser
server.app.use( bodyParser.urlencoded({ extended: true }) );
server.app.use( bodyParser.json() );

// CORS
server.app.use( cors({ origin: true, credentials: true  }) );

// Rutas de servicios
server.app.use('/', router );

server.start( () => {
    console.log(`Servidor corriendo en el puerto ${ server.port }`);
});


