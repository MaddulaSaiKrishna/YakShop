import { Injectable } from '@angular/core';
import { User } from '../model/user.model';

@Injectable()
export class AppDataService {

  constructor() { }

  user: User;
  recentlyPlacedOrder: any;
  isLoggedIn: boolean = false;

  setUser(userData){
    this.user = userData;
    this.isLoggedIn = true;
  }
  getUser(){
    return this.user;
  }

  setRecentOrder(order: any){
    this.recentlyPlacedOrder = order;
  }
  getRecentOrder(){
    return this.recentlyPlacedOrder;
  }
}
