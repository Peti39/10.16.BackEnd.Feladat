import { Injectable } from '@nestjs/common';
import mysql, { ResultSetHeader } from 'mysql2/promise'


const db = mysql.createPool({
  host : 'localhost',
  user : 'root',
  database : 'wshop'
});

export interface Product {
  id: number;
  name: string;
  imageUrl: string;
}

export interface Order{
  productId: number,
  name: string,
  address: string,
  billing: string,
}

@Injectable() 
export class AppService {
  private products: Product[] = [
      { id: 0, name: 'Product 1', imageUrl: 'https://i.imgur.com/HNLObkk.jpeg' },
      { id: 1, name: 'Product 2', imageUrl: 'https://i.imgur.com/O89vfci.jpeg' },
      { id: 2, name: 'Product 3', imageUrl: 'https://i.imgur.com/Cz0DO7Q.jpeg' },
    ];

  getHello(): string {
    return 'Hello World!';
  }

  getProducts(): Product[] {
    const products = this.products;
    return products as Product[];
  }

  async saveOrder(order: Order) {
    console.log(order)
    const [results, _ ] : [ResultSetHeader, any] = await db.query("INSERT INTO `rendeles`(`termek`, `nev`, `szamlazascim`, `szallitasicim`) VALUES (?,?,?,?)",[this.products[order.productId].name, order.name, order.billing, order.address]);
    console.log(results)
    if(results.affectedRows == 0){
      return false
    }else{
      return true
    }
  }
}
