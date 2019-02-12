import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, timer, Subscription } from 'rxjs';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  yakMilk: number = 0;
  yakSkins: number = 0;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const source = timer(0, 60000);
    this.subscription = source.subscribe(val => {
      this.http.get("http://localhost:8080/yak-shop/herd/0").subscribe((res: any) => {
        let uploadedDate = res["herdDetails"].uploadedDate;
        let today = new Date().getTime();
        let timeDiff = Math.abs(today - uploadedDate);
        let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        // Query the database to get the latest stock information.
        this.http.get("http://localhost:8080/yak-shop/stock/" + diffDays).subscribe((res: any) => {
          this.yakMilk = res.milk;
          this.yakSkins = res.skins;
        });
      });
    });
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
