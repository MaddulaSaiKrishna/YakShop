import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private router: Router, private http:HttpClient) { }

  ngOnInit() {
  }

  onLogin(form: NgForm){
    this.http.post("http://localhost:8080/register", form.value).subscribe((res: any) => {
      if(res){
        console.log(res.message);
        this.router.navigate(["/login"]); 
      }
    },
    (err) => {
      console.log(err.message);
    });
  }
}
