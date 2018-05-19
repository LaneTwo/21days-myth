import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { HabitService } from '../habit.service';

@Component({
  selector: 'app-habit-detail',
  templateUrl: './habit-detail.component.html',
  styleUrls: ['./habit-detail.component.css'],
  providers: [HabitService]
})


export class HabitDetailComponent implements OnInit {
  @Input() habit;
  checkinDescription: string;
  checkinDetail: string;
  model: NgbDateStruct;
  maxDate: NgbDateStruct = {year: new Date().getFullYear(), month:new Date().getMonth() + 1, day:new Date().getDate()};
  minDate: NgbDateStruct = {year: new Date().getFullYear(), month:new Date().getMonth() + 1, day:new Date().getDate()};
  progressPercent: number;
  progressText: string;
  habitPeriod: number;

  DAY_TO_SECONDS = 86400;

  constructor(private habitService: HabitService) { }

  ngOnInit() {
    this.habitPeriod = Math.floor((this.habit.endDate - this.habit.startDate) / this.DAY_TO_SECONDS);
    this.progressPercent = this.habit.checkinDays * 100 / this.habitPeriod;
    this.progressText = this.habit.checkinDays.toString() + "/" + this.habitPeriod.toString();

    var endDate = new Date(this.habit.endDate * 1000);
    this.maxDate.year = endDate.getFullYear();
    this.maxDate.month = endDate.getMonth() + 1;
    this.maxDate.day = endDate.getDate() - 1;

    var startDate = new Date(this.habit.startDate * 1000);
    this.minDate.year = startDate.getFullYear();
    this.minDate.month = startDate.getMonth() + 1;
    this.minDate.day = startDate.getDate();
  }

  isCheckedIn(date: NgbDateStruct) {
    var timestamp = Math.floor((new Date(date.year, date.month - 1, date.day)).getTime() / 1000);
    var checkinDescription = [];
    var checkinExist = false;

    var checkinEvents = this.habit.checkinEvents;
    for(var i = 0; i < checkinEvents.length; i++){
      if((checkinEvents[i].timestamp >= timestamp) && (checkinEvents[i].timestamp < (timestamp + this.DAY_TO_SECONDS))){
        //checkinDescription.push(checkinEvents[i].description);
        checkinExist = true;
      }
    }
    return checkinExist;
  }

  displayCheckinDetail(date: NgbDateStruct) {
    var timestamp = Math.floor((new Date(date.year, date.month - 1, date.day)).getTime() / 1000);
    var checkinDescription = [];

    var checkinEvents = this.habit.checkinEvents;
    for(var i = 0; i < checkinEvents.length; i++){
      if((checkinEvents[i].timestamp >= timestamp) && (checkinEvents[i].timestamp < (timestamp + this.DAY_TO_SECONDS))){
        checkinDescription.push(checkinEvents[i].description.replace(/\n/g, "<br>"));
      }
    }

    this.checkinDetail = checkinDescription.join("<br><br>");
  }

  isDisabled(date: NgbDateStruct, current: {month: number}) {
    var timestamp = Math.floor((new Date(date.year, date.month - 1, date.day)).getTime() / 1000);

    return (timestamp < this.habit.startDate || timestamp >= this.habit.endDate);
    //return date.month !== current.month;
  }

  checkin(){
    var description = this.checkinDescription.replace(/\n/g, "\\n");
    this.habitService.checkinActivity(this.habit.index, description, function(resp){
      console.log(resp);
    });
  }

  withdraw(){
    this.habitService.withdrawDeposit(this.habit.index, function(resp){
      console.log(resp);
    });
  }

  isActivityEnd(){
    var currentTimestamp = Math.floor((new Date()).getTime() / 1000);
    return (this.habit.state !== 0) || (currentTimestamp > this.habit.endDate);
  }

  getProgress(){

  }
}
