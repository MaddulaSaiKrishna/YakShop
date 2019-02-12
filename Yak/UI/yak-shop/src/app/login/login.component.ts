import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AppDataService } from './../Shared/services/app-data.service';
import { User } from '../Shared/model/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, public appDataSrvc: AppDataService) { }

  ngOnInit() {
  }

  onLogin(form: NgForm){
    this.http.post("http://localhost:8080/login", form.value).subscribe((res: any) => {
      if (res) {
        console.log("Login user successful!");
        // save res in a service.
        this.appDataSrvc.setUser(res.user);
        this.router.navigate(["/"]);
      }
    },
    (err) => {
      console.log("Login failed!");
    });
  }
}
