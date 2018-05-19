import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-content',
  template: `
  <div class="modal-header">
  <h4 class="modal-title">刻意练习 -- 从新手到大师</h4>
  <button type="button" class="close" aria-label="Close" (click)="d('Cross click')">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
<div class="modal-body">
    21天减肥法，21天学通C++... <br>你可能看过太多的21天怎样怎样，也听说过养成（或改变）一个习惯只需要21天...

</div>
<div class="modal-footer">
  <button type="button" class="btn btn-outline-dark" (click)="c('Close click')">朕知道了</button>
</div
  `
})
export class NgbdModalContent {

  constructor(public activeModal: NgbActiveModal) {}
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  isFirstLoad: string = 'YES';

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
    if(window.localStorage){
      let firstLoad = window.localStorage.getItem('21days_isFirstLoad');
      if(firstLoad){
        this.isFirstLoad = firstLoad;
      }
    }
  }
  goMainPage() {
    this.isFirstLoad = 'NO';
    if(window.localStorage){     
      if(window.localStorage){
        window.localStorage.setItem('21days_isFirstLoad', this.isFirstLoad);
      }
    }
  }
}
