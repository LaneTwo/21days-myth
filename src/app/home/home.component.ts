import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HabitService } from '../habit.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [HabitService]
})
export class HomeComponent implements OnInit {

  activities = [];
  showAlert = false;
  errorMessage = "";

  constructor(private habitService: HabitService) { }

  ngOnInit() {
    this.habitService.loadAllActivities().then(resp => {
        if(resp.execute_err !== "" && resp.execute_err != "insufficient balance"){
          console.log("error:" + resp.execute_err);
          this.errorMessage = resp.execute_err;
          this.showAlert = true;
        }else{
          // console.log("--------------------------------> All activities:");
          // console.log(resp.result);
          var results = JSON.parse(resp.result);
          for(var i = 0; i < results.length; i++){
            results[i].description = results[i].description.replace(/\n/g, "<br>");
          }
          
          this.activities = results;
        }        
    }).catch(err => {
        console.log("error:" + err.message);
        this.errorMessage = err.message;
        this.showAlert = true;
    });
  }

  public closeAlert() {
    this.showAlert = false;
  }

  getProgressPercent(activity){
    var habitPeriod = Math.floor((activity.endDate - activity.startDate) / 86400);
    var progressPercent = activity.checkinDays * 100 / habitPeriod;
    
    return progressPercent;
  }

  getProgressText(activity){
    var habitPeriod = Math.floor((activity.endDate - activity.startDate) / 86400);
    var progressText = activity.checkinDays.toString() + "/" + habitPeriod.toString();

    return progressText;
  }
}
