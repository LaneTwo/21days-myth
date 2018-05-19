import { Component, OnInit, Input, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { HabitService } from '../habit.service';

declare var webExtensionWallet: any;

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css'],
  providers: [HabitService]
})
export class PersonalComponent implements OnInit {
  showNewHabit: boolean = false;
  activities = [];
  startDate: NgbDateStruct = {year: new Date().getFullYear(), month:new Date().getMonth() + 1, day:new Date().getDate()};
  endDate: NgbDateStruct = {year: new Date().getFullYear(), month:new Date().getMonth() + 1, day:new Date().getDate() + 7};
  habitTitle: string;
  habitDescription: string;
  depositAmount = 0.001;

  constructor(private habitService: HabitService, private _ngZone: NgZone) { }

  ngOnInit() {
    this.refresh();
  }

  cancel(){
    this.showNewHabit = false;
    this.habitTitle = "";
    this.habitDescription = "";
    this.depositAmount = 0.001;
  }

  refresh(){
    this.habitService.getUserActivities(resp => {
      this._ngZone.run(() =>{
        var results = JSON.parse(resp.result);

        for(var i = 0; i < results.length; i++){
          results[i].description = results[i].description.replace(/\n/g, "<br>");
        }

        this.activities = results;
        console.log(this.activities);
      });

    });
  }

  create(){
    console.log(this.habitDescription);
    var description = this.habitDescription.replace(/\n/g, "\\n");
    console.log(description);
    var startDay = Math.floor(Date.parse(this.startDate.year +"-" + this.startDate.month + "-" + this.startDate.day)/1000);
    var endDay = Math.floor(Date.parse(this.endDate.year +"-" + this.endDate.month + "-" + this.endDate.day) / 1000);
    this.habitService.createActivity(this.habitTitle, description, startDay, endDay, Number(this.depositAmount), resp => {
      this._ngZone.run(() =>{
        console.log(resp);
        this.showNewHabit = false;
      });
    });
  }
}
