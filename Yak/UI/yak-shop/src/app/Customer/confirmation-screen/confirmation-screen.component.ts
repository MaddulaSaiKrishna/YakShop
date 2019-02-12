import { Component, OnInit } from '@angular/core';

import { AppDataService } from './../../Shared/services/app-data.service';

@Component({
  selector: 'app-confirmation-screen',
  templateUrl: './confirmation-screen.component.html',
  styleUrls: ['./confirmation-screen.component.css']
})
export class ConfirmationScreenComponent implements OnInit {
  orderDetails: any = {"milk": 0, "skins": 0};
  confirmMsg: string = "";

  constructor(private appDataSrvc: AppDataService) { }

  ngOnInit() {
    let data = this.appDataSrvc.getRecentOrder();
    this.orderDetails = data["orderDetails"];
    this.confirmMsg = data["message"]
  }

}
