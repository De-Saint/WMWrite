import { Component } from '@angular/core';
import { NavController, NavParams, Events, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ILoginUser } from '../../models/Interface';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { HomeTabPage } from '../home-tab/home-tab';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  submitted = false;
  HAS_LOGGED_IN = 'hasLoggedIn';
  loggedInUserDetails: ILoginUser[];
  login: { emailphone?: string, password?: string } = {};
  UserDetails: any;
  code: any;
  Username: any;
  userid: any;
  constructor(public events: Events, public datalink: DatalinkProvider, public toastCtrl: ToastController, 
    public storage: Storage, public alertCtrl: AlertController,
 public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) { }

  showPassword(input: any): any {
    input.type = input.type === 'password' ? 'text' : 'password';
  }
  onLogin(form) {
    this.submitted = true;
    if (form.valid) {
      this.validateLogin(this.login.emailphone, this.login.password);
    }
  }

  validateLogin(emailphone, password) {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.login(emailphone, password)
      .subscribe(loggedInUserDetails => {
        this.loggedInUserDetails = loggedInUserDetails;
        this.code = loggedInUserDetails[0];
        if (this.code != "200") {
          this.datalink.displayAlert("Error ", loggedInUserDetails[1]);
          this.events.publish('user:logout');
          loading.dismiss().catch(() => { });
        } else {
          this.storage.ready().then(() => {
            this.storage.set('hasSeenWelcome', true);
            this.storage.set(this.HAS_LOGGED_IN, true);
          });
          this.datalink.SetloggedInUserDetails(this.loggedInUserDetails);
          this.UserDetails = loggedInUserDetails[1];
          this.Username = this.UserDetails.last_name + " " + this.UserDetails.first_name;
          this.datalink.showToast('bottom', "Welcome " + this.Username);
          this.gotoHomePage(loading);
          // this.dataservice.setuser(
          //   this.UserDetails.userId, this.UserDetails.first_name, this.UserDetails.last_name,
          //   this.UserDetails.email, this.UserDetails.phone_number, this.UserDetails.password);
          this.events.publish('user:login', this.Username);
        }
        loading.dismiss().catch(() => { });
      }, (err) => {
        loading.dismiss().catch(() => { });
        this.datalink.showToast('bottom', "Error connecting to server");
        return false;
      });
  }
  gotoHomePage(loading) {
    this.navCtrl.setRoot(HomeTabPage).then(() => {
      this.storage.ready().then(() => {
        this.storage.set('hasSeenLogin', true);
        loading.dismiss().catch(() => { });
      });
    });
  }
}
