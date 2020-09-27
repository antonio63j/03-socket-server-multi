


import { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } from 'http-status-codes';

class Node<T> {
  next:  Node<T> | null = null;
  constructor(public data: T) {
  }
}

// Cola
export class Cola<T> {
    head:  Node<T> | null = null;
    tail: Node<T> | null = null;
    numItems: number = 0;
    maxMumItems: number = 1000;
    
    constructor(
      private optMaxNumItems?: number) {
      }    


    mete (data: T): void {
      if (this.optMaxNumItems !== undefined) {
        this.maxMumItems = this.optMaxNumItems
      }

     if (this.numItems >= this.maxMumItems) {
        throw {status: StatusCodes.INSUFFICIENT_STORAGE, mensaje: getReasonPhrase(StatusCodes.INSUFFICIENT_STORAGE)} 
      }
      
      const node = new Node(data);
      this.numItems = this.numItems + 1;
  
      if (this.isEmpty()) {
        this.head = this.tail = node;
        return;
      }
  
      if (this.tail !== null) {
         this.tail.next = node;}
      this.tail = node;
    }
  
    saca (): T | null {
      let data: T | null = null;
  
      if (this.isEmpty()) {
        return null;
      }
      if (this.head ) {
         data = this.head.data;
         this.head = this.head.next;
         this.numItems = this.numItems - 1;
      } 
      if (this.numItems == 0 ){
          this.tail = null;
      }
        return data;
    }
  
    isEmpty() {
      return this.head === null;
    }

    length(): number {
      return this.numItems;
    }
  
  }

  // Pila
  export class Pila<T> {
    head:  Node<T> | null = null;
    numItems: number = 0;
    constructor() {
    }
  
    mete(data: T): void {
      const node = new Node(data);
      this.numItems = this.numItems + 1;
  
      if (this.isEmpty()) {
        this.head = node;
        return;
      }

      node.next = this.head;
      this.head = node;
     
      if(this.head) {
        data = this.head.data;
      }

    }
  
    saca(): T | null {
      let data: T | null = null;

      if (this.isEmpty()) {
        return null;
      }

      if (this.head) {
        data = this.head.data;
        this.head = this.head.next;
        this.numItems = this.numItems - 1;
      }
      return data;
    }  
  
    isEmpty() {
      return this.head === null;
    }

    public length(): number {
      return this.numItems;
    }

   lee (numItems: number ): T [] {
      let t: T [] = [];
      let i:number;
      
      let nextRead: Node<T> | null;
      nextRead = this.head;
      for (i= 0;  i < numItems && i < this.length(); i = i + 1){
        if (nextRead){ 
          t.push(nextRead.data);
          nextRead = nextRead.next;
         }
      } 
      return t;
    }
  
  }


