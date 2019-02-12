import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-herd',
  templateUrl: './upload-herd.component.html',
  styleUrls: ['./upload-herd.component.css']
})
export class UploadHerdComponent implements OnInit {
  herdDetailsForm:FormGroup;
  existingHerd: boolean = false;
  existingHerdInfo: any[] = [];
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.http.get("http://localhost:8080/yak-shop/herd/0").subscribe((res: any) => {
      if (res["herdDetails"]){
        var uploadedDate = res["herdDetails"].uploadedDate;
        var today = new Date().getTime();
        var timeDiff = Math.abs(today - uploadedDate);
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        this.http.get("http://localhost:8080/yak-shop/herd/" + diffDays).subscribe((res: any) => {
          if (res) {
            this.existingHerd = true;
            this.existingHerdInfo = res["herdDetails"]["herd"];
          } else {
            this.existingHerd = false;
          }
        }, (err) => {
          console.log("error getting herd details");
        });
      } else {
        this.existingHerd = false;
      }
      
    });

    this.herdDetailsForm = new FormGroup({
      "herdDetails": new FormArray([])
    })
    this.onAddRow();

  }

  onSubmit(){
    console.log(this.herdDetailsForm.value.herdDetails);
    this.http.post("http://localhost:8080/yak-shop/load", this.herdDetailsForm.value.herdDetails).subscribe((res: any) => {
      this.router.navigate(["/"]);
    }, (err) => {
    });
  }

  onAddRow(){
    const rowStructure = new FormGroup({
      "name": new FormControl(null, Validators.required),
      "age": new FormControl(null, Validators.required),
      "sex": new FormControl(null, Validators.required)
    });
    (<FormArray>this.herdDetailsForm.get("herdDetails")).push(rowStructure);
  }

  onDeleteRow(index: number){
    if(index != 0){
      (<FormArray>this.herdDetailsForm.get("herdDetails")).removeAt(index);
    }
  }

  uploadNewHerd(){
    this.existingHerd = false;
  }
}
