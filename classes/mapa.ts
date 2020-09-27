import { Marcador } from "./marcador";

export class Mapa {

    constructor() {


    }

    private marcadores: {[key: string]: Marcador } = {};

    public getMarcadores():any {
        return this.marcadores;
    }

    public agregarMarcador (marcador: Marcador) {
      this.marcadores[marcador.id] = marcador;
    }

    public borrarMarcador(id: string){
        delete this.marcadores[id];
        return this.getMarcadores();
    }

    public moverMarcador(marcador: Marcador){
          this.marcadores[marcador.id].lat = marcador.lat;
          this.marcadores[marcador.id].lng = marcador.lng;
    }
}
