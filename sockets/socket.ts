import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';
import { Marcador } from '../classes/marcador';
import { Mapa } from '../classes/mapa';

export const usuariosConectados = new UsuariosLista();
export const mapa = new Mapa;

export const conectarCliente = ( cliente: Socket, io: socketIO.Server ) => {
    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregar( usuario );
}

export const desconectar = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');

        usuariosConectados.borrarUsuario( cliente.id );

        io.emit('usuarios-activos', usuariosConectados.getLista()  );

    });

}

// actualizacion de encuesta
/* export const  actualizarClientes = ( io: socketIO.Server) => {
    console.log ('envio mensaje de actualizacion a clientes');
    io.emit ('actualizacion-encuesta');
} */

// escucha mensajes de nuevo-marcador

export const escuchaNuevoMarcador = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('marcador-nuevo', (marcador: Marcador) => {
        mapa.agregarMarcador(marcador);
        // difunde a todos menos al cliente que ha mandado el nuevo marcador
        cliente.broadcast.emit('marcador-crear', marcador);

        console.log(`nuevo marcador, mapa: ${JSON.stringify(mapa.getMarcadores())}`);

        // callback({
        //     ok: true,
        //     mensaje: `broadcast marcador-crear con id ${marcador.id}, configurado`
        // });
    });
}

export const escucharBorrarMarcador = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('peticion-marcador-borrar', (marcadorId: string) => {

        mapa.borrarMarcador(marcadorId);

        cliente.broadcast.emit('marcador-borrar', marcadorId);

        console.log('emitiendo broadcast marcador-crear')

        // callback({
        //     ok: true,
        //     mensaje: `broadcast marcador-crear con id ${marcador.id}, configurado`
        // });
    });
}

export const escucharMoverMarcador = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('peticion-marcador-mover', (marcador: Marcador) => {

        cliente.broadcast.emit('marcador-mover', marcador);

        console.log('emitiendo broadcast marcador-mover')

        // callback({
        //     ok: true,
        //     mensaje: `broadcast marcador-crear con id ${marcador.id}, configurado`
        // });
    });
}


// Escuchar mensajes
export const mensaje = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('mensaje', (  payload: { de: string, cuerpo: string }  ) => {

        console.log('Mensaje recibido', payload );

        io.emit('mensaje-nuevo', payload );

    });

}



// Configurar usuario
export const configurarUsuario = (cliente: Socket, io: socketIO.Server) => {

    cliente.on('configurar-usuario', (payload: { nombre: string }, callback: Function) => {

        usuariosConectados.actualizarNombre(cliente.id, payload.nombre);

        io.emit('usuarios-activos', usuariosConectados.getLista());

        callback({
            ok: true,
            mensaje: `Usuario ${payload.nombre}, configurado`
        });
    });

}


// Obtener Usuarios
export const obtenerUsuarios = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('obtener-usuarios', () => {

        io.to( cliente.id ).emit('usuarios-activos', usuariosConectados.getLista()  );
        
    });

}
