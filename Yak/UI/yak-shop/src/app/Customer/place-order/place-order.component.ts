import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppDataService } from './../../Shared/services/app-data.service';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private appDataSrvc: AppDataService) { }

  ngOnInit() {
  }

  yakMilk: number = 0;
  yakHide: number = 0;
  yakMilkCost: number = 100;
  yakHideCost: number = 200;

  increment(product){
    switch(product){
      case "yakMilk": this.yakMilk++;break;
      case "yakHide": this.yakHide++;break;
    }
  }
  decrement(product){
    switch(product){
      case "yakMilk": this.yakMilk > 0 ? this.yakMilk-- : 0;break;
      case "yakHide": this.yakHide > 0 ? this.yakHide-- : 0;break;
    }
  }

  order(){
    var postObj = {
      "customer":"",
      "order":{"milk": this.yakMilk, "skins": this.yakHide}
    };
    this.http.get("http://localhost:8080/yak-shop/herd/0").subscribe((res: any) => {
      var uploadedDate = res["herdDetails"].uploadedDate;
      var today = new Date().getTime();
      var timeDiff = Math.abs(today - uploadedDate);
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      // get the number of the day and place the order.
      this.http.post("http://localhost:8080/yak-shop/order/" + diffDays, postObj).subscribe((res: any) => {
        console.log(res.message);
        // save the order details in angular service, so that we can retrieve and show them in confirmation page.
        this.appDataSrvc.setRecentOrder(res);
        this.router.navigate(["/confirmation"]);
      }, (err) => {
        if(err.status == 404){
          this.appDataSrvc.setRecentOrder(err.error);
          this.router.navigate(["/confirmation"]);
        }
        console.log(err.error);
      });
    });
  }
}
