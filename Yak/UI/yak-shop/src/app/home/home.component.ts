import { AppDataService } from './../Shared/services/app-data.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../Shared/model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;
    
  constructor(private appDataService: AppDataService, private router: Router) { }

  ngOnInit() {
    this.isLoggedIn = this.appDataService.isLoggedIn;
    let userDetails: User = this.appDataService.getUser();
    if(this.isLoggedIn && userDetails){
      this.isAdmin = (userDetails.role == "admin");
    }
  }

  onLogout(){
    this.appDataService.isLoggedIn = false;
    this.appDataService.setUser(null);

    this.isLoggedIn = this.appDataService.isLoggedIn;
    let userDetails: User = this.appDataService.getUser();

    this.router.navigate(["/login"]);
  }
}
