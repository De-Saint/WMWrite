import { Component } from '@angular/core';
import { NavController, NavParams, Nav, AlertController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  details: any;
  rootNavCtrl: NavController;
  fname: any;
  lname: any;
  ema: any;
  pho: any;
  utype: any;
  id: any;
  constructor(public storage: Storage, public events: Events,
    public alertCtrl: AlertController, public nav: Nav,
    public navCtrl: NavController, public navParams: NavParams) {
   
    this.rootNavCtrl = this.navParams.get('rootNavCtrl');
  }

  ionViewWillEnter() {
    this.getDetails();
  }

  getDetails() {
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.details = loggedInUserDetails[1];
          console.log(this.details);
        }
      });
    });
  }

  onLogout() {
    let confirm = this.alertCtrl.create({
      title: 'LogOut',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log("cancelled");
          }
        },
        {
          text: 'Yes',
          handler: () => {
            setTimeout(() => {
              this.storage.ready().then(() => {
                this.storage.remove('userid');
                this.storage.remove('hasLoggedIn');
                this.storage.remove('hasSeenLogin');
                this.storage.remove('hasSeenWelcome');
                this.storage.remove('loggedInUserDetails');
                this.rootNavCtrl.push(LoginPage);
              });

            }, 1000);
          }
        }
      ]
    });
    confirm.present();
  }
}

