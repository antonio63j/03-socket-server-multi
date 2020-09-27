
import { Router, Request, Response } from 'express';
import Server from '../classes/server';
import { usuariosConectados, mapa } from '../sockets/socket';
import { GraficaData } from '../classes/grafica';
import { Ticket, TicketGestion } from '../classes/ticket';
const router = Router();

import {
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
} from 'http-status-codes';

// tickets
let ticketG = new  TicketGestion();

router.post('/ticket', ( req: Request, res: Response  ) => {

    let ticket: Ticket = req.body;
    let resp: any;

    try {
      ticketG.meteTicket(ticket);
        resp = {status: StatusCodes.OK, data: `ticket ${ticket.id} dado de alta`};
    } catch (err) {
        resp = {status: err.status, data: err.mensaje}
      }
    res.status(resp.status).json( resp);
});

router.get('/ticket', ( req: Request, res: Response  ) => {
   let escritorio: number = req.body.escritorio;
   let ticket: Ticket | null = ticketG.sacaTicket();
   let resp: any;
   if (ticket !== null) {
      resp = {status: StatusCodes.OK, data: ticket};
   } else {
      resp = {status: StatusCodes.NO_CONTENT, data: `No hay tickets para atender`};
   }
   res.status(resp.status).json( resp.data);
});

router.post('/atendidos', ( req: Request, res: Response  ) => {
    const ticket: Ticket = req.body;
    ticketG.meteAtendidos(ticket);
    res.status(StatusCodes.OK).json(getReasonPhrase(StatusCodes.OK));

    // difundirUltmosAtendidos(): void {
        const server = Server.instance;
        server.io.emit('ultimos-atendidos', ticketG.ultimosAtendidos(4) );    

    });


router.get('/atendidos', ( req: Request, res: Response  ) => {
    let numTickets: number;
    if (!req.body.numTickets) {
        numTickets = 4;
    } else {
        numTickets = req.body.numTickets;
    }
    console.log(numTickets);
    res.json (ticketG.ultimosAtendidos(numTickets));

 });
 

// para mapas
router.get('/mapa', ( req: Request, res: Response  ) => {
    res.json( mapa.getMarcadores() );
    console.log( `marcadore para carga: ${JSON.stringify(mapa.getMarcadores())}`)
});

// para graficas
const grafica = new GraficaData();

router.get('/grafica', ( req: Request, res: Response  ) => {

    res.json( grafica.getDataGrafica() );

});

router.post('/grafica', ( req: Request, res: Response  ) => {

    const opcion   = req.body.opcion;
    const unidades = Number( req.body.unidades );

    grafica.incrementarValor( opcion, unidades );

    const server = Server.instance;
    server.io.emit('actualizacion-encuesta', grafica.getDataGrafica() );

    res.json( grafica.getDataGrafica() );

});


router.post('/mensajes/:id', ( req: Request, res: Response  ) => {

    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;
    const id     = req.params.id;

    const payload = {
        de,
        cuerpo
    }

    const server = Server.instance;

    server.io.in( id ).emit( 'mensaje-privado', payload );

    res.json({
        ok: true,
        cuerpo,
        de,
        id
    });
});


// Servicio para obtener todos los IDs de los usuarios
router.get('/usuarios', (  req: Request, res: Response ) => {

    const server = Server.instance;

    server.io.clients( ( err: any, clientes: string[] ) => {

        if ( err ) {
            return res.json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            clientes
        });
    });
});

// Obtener usuarios y sus nombres
router.get('/usuarios/detalle', (  req: Request, res: Response ) => {

    res.json({
        ok: true,
        clientes: usuariosConectados.getLista()
    });
});

export default router;


