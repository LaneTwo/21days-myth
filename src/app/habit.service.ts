import { Injectable } from '@angular/core';

declare var NebPay: any;
declare var nebulas: any;

@Injectable({
  providedIn: 'root'
})
export class HabitService {

  contractAddress = "n1zyVKkiUttgYkQ2kuJkswi51jiKFj9yMoX";
  constructor() { }

  loadAllActivities(){
    var Account = nebulas.Account;
    var neb = new nebulas.Neb();
    neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));

    var serialNumber;

    var from = Account.NewAccount().getAddressString();

		console.log("from:" + from);
    var value = "0";
    var nonce = "0"
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callFunction = "getAllActivities";
    var callArgs = "";
    var contract = {
        "function": callFunction,
        "args": callArgs
    }

    return neb.api.call(from, this.contractAddress,value,nonce,gas_price,gas_limit,contract);        
  }

  getUserActivities(callback){
    let nebPay = new NebPay();
    var callbackUrl = NebPay.config.testnetUrl;
    var serialNumber;

    console.log(callbackUrl);

    var listener = function(resp) {
      console.log("getUserActivities listener resp: " + JSON.stringify(resp));
      callback(resp);
    }

    var callFunction = "getUserActivities";
    var callArgs = "";

    serialNumber = nebPay.simulateCall(this.contractAddress, 0, callFunction, callArgs, {
        callback:callbackUrl,
        listener: listener  //set listener for extension transaction result
    });
  }

  createActivity(title, description, startDate, endDate, value, callback){
    let nebPay = new NebPay();
    var callbackUrl = NebPay.config.testnetUrl;
    var serialNumber;

    console.log(callbackUrl);

    var listener = function(resp) {
      console.log("createActivity listener resp: " + JSON.stringify(resp));
    }

    function onrefreshClick() {
      nebPay.queryPayInfo(serialNumber,{callback: callbackUrl})   //search transaction result from server (result upload to server by app)
      .then(function (resp) {
        console.log("createActivity fresh resp: " + JSON.stringify(resp));
        callback(resp);        
      })
      .catch(function (err) {
          console.log(err);
      });
    }

    var callFunction = "createActivity"
    var callArgs = "[\"" + title + "\",\"" + description + "\"," + startDate.toString() + "," + endDate.toString() + "]";

    serialNumber = nebPay.call(this.contractAddress, value, callFunction, callArgs, {
        callback:callbackUrl,
        listener: listener  //set listener for extension transaction result
    });
    setTimeout(() => {
        onrefreshClick();
    }, 2000);    
  }

  checkinActivity(index, description, callback){
    let nebPay = new NebPay();
    var callbackUrl = NebPay.config.testnetUrl;
    var serialNumber;

    console.log(callbackUrl);

    var listener = function(resp) {
      //console.log("createActivity listener resp: " + JSON.stringify(resp));
      callback(JSON.stringify(resp));
    }

    var callFunction = "checkinActivity";
    var callArgs = "["+ index.toString() +  ",\"" + description + "\"]";

    serialNumber = nebPay.call(this.contractAddress, 0, callFunction, callArgs, {
        callback:callbackUrl,
        listener: listener  //set listener for extension transaction result
    });  
  }

  withdrawDeposit(index, callback){
    let nebPay = new NebPay();
    var callbackUrl = NebPay.config.testnetUrl;

    var listener = function(resp) {
      //console.log("withdrawDeposit listener resp: " + JSON.stringify(resp));
      callback(JSON.stringify(resp));
    }

    var callFunction = "withdrawMyDeposit";
    var callArgs = "["+ index.toString() +   "]";

    nebPay.call(this.contractAddress, 0, callFunction, callArgs, {
        callback:callbackUrl,
        listener: listener  //set listener for extension transaction result
    });
  }
}
