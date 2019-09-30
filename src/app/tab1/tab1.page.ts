import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { element } from '@angular/core/src/render3';
import { TouchSequence } from 'selenium-webdriver';
import { Order} from '../../models/order';


@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {

  UID:string;
  name:string;
  orderTime:string;
  title:string;

  orders:Order[];

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.orderService.selectAll().forEach(element=>{
      console.log(element);
      this.orders=element; 
    })

    // this.orderService.getPackTitle().forEach(value=>{
    //   this.title=value.title;
    //   console.log('title:'+this.title)
    // });
  }
  
}
