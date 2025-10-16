import { BadRequestException, Body, Controller, Get, HttpStatus, Post, Query, Redirect, Render, Res } from '@nestjs/common';
import { AppService, Order } from './app.service';
import { error } from 'console';
import type { Response } from 'express';

class BuyProductDto {
  productId: string;
}

class NewOrderDto {
  productId: string;
  name: string;
  address: string;
  billing: string;
  coupon: string;
  cardNumber: string;
  experation: string;
  cvc: string;
}



@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return { message: this.appService.getHello(), products: this.appService.getProducts() };
  }

  @Get('buy')
  @Render('buyProductForm')
  buyProductFrom(@Query() dto : BuyProductDto) {
    return { slecetedProductId: dto.productId, errors : [], dto: {} };
  }

  @Post('buy') 
  //@Render('buyProductForm')
  async handleBuyProduct(@Body() newOrderDto : NewOrderDto, @Res() res: Response) {
    const errors : string[] = [];
    const products = this.appService.getProducts();

    // Product
    const productId = parseInt(newOrderDto.productId);
    if(isNaN(productId)) {
      errors.push('Product is required!');
    }
    const selectedProduct = products.find(p => p.id === productId);

    console.log(productId);
    console.log(selectedProduct);
    if(!selectedProduct) {
      errors.push('Invalid product!');
    }
    // Name
    if(!newOrderDto.name){
      errors.push('Name is required!');
    }else if(newOrderDto.name.trim() == "") {
      errors.push('Name is required!');
    }
    // Address
    if(!newOrderDto.address){
      errors.push('Address is required!');
    }else if(newOrderDto.address.trim() == "") {
      errors.push('Address is required!');
    }
    // Billing
    if(!newOrderDto.billing){
      errors.push('Billing is required!');
    }else if(newOrderDto.billing.trim() == "") {
      errors.push('Billing is required!');
    }
    // Card number
    if(!newOrderDto.cardNumber){
      errors.push('Card number is required!');
    }else if(newOrderDto.cardNumber.trim() == "") {
      errors.push('Card number is required!');
    }
    // Experation
    if(!newOrderDto.experation){
      errors.push('Experation is required!');
    }else if(newOrderDto.experation.trim() == "") {
      errors.push('Experation is required!');
    }

    // CVC
    const cvc = parseInt(newOrderDto.cvc);
    
    if(!newOrderDto.cvc){
      errors.push('CVC is required!');
    }else if(newOrderDto.cvc.trim() == "") {
      errors.push('CVC is required!');
    }else if(isNaN(cvc)) {
      errors.push('CVC must be a number!');
    }else if(cvc <= 100 || cvc >= 999) {
      errors.push('CVC must be a 3 digit number!');
    }
    
    if(errors.length === 0) {
      // Success
      // Here you can save the order to database
      const result = await this.appService.saveOrder({ productId: productId, name: newOrderDto.name, address: newOrderDto.address, billing: newOrderDto.billing } as Order);
      
      console.log(result);
      if(!result) {
        throw new BadRequestException('Order could not be saved!');
      }
      res.redirect('/success');
    }else {
      // Error
      newOrderDto.cvc = '';
      newOrderDto.cardNumber = '';
      newOrderDto.experation = '';
      
      res.status(HttpStatus.BAD_REQUEST).render('buyProductForm', { dto : newOrderDto, errors: errors, slecetedProductId: newOrderDto.productId  });
    }
  }

  @Get('success')
  @Render('success')
  orderSuccess() { 
    return { message: 'Order successful!' };
  }
}
