

export class Ticket {

   public id: string;
   private escritorio : null | number = null;
   private dateCreacion?: Date;
   private dateAtencion?: Date;

   constructor (id: string){
       this.id = id;
   }

   getId(): string {
     return this.id;
   }

}

import { Cola, Pila } from './contenedores';

export class TicketGestion {
   
    tickets: Cola<Ticket> = new Cola<Ticket>(5);
    ticketsAtendidos: Pila<Ticket> = new Pila<Ticket>();

    meteTicket (ticket: Ticket) {
      this.tickets.mete(ticket);
    }

    sacaTicket (): Ticket | null {
        return this.tickets.saca();
    }

    numTickets (): number {
        return this.tickets.length();
    }

    meteAtendidos (ticket: Ticket) {
        this.ticketsAtendidos.mete(ticket);
    }

    ultimosAtendidos (numItems: number ): Ticket [] {
       return this.ticketsAtendidos.lee(numItems);
    }

}
