import { Component } from '@angular/core';
import { Platform, Events, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HeaderColor } from '@ionic-native/header-color';
import { Storage } from '@ionic/storage';

import { LoginPage } from '../pages/login/login';

import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { App } from 'ionic-angular/components/app/app';
import { DatalinkProvider } from '../providers/datalink/datalink';
import { HomeTabPage } from '../pages/home-tab/home-tab';
import { Keyboard } from '@ionic-native/keyboard';
@Component({
  templateUrl: 'app.html'
})
export class WMWrite {
  rootPage: any;
  activePage: any;
  Userfullname: any;
  Details: any;
  usertype: any;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public events: Events,
    public headerColor: HeaderColor,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public app: App, public storage: Storage,
    public datalink: DatalinkProvider,
    public keyboard: Keyboard,
    public splashScreen: SplashScreen
  ) {
    this.storage.ready().then(() => {
      this.storage.get('hasSeenLogin')
        .then((hasSeenWelcome) => {
          if (hasSeenWelcome) {
            this.storage.get('hasSeenWelcome') // Check if the user has already seen the LoginPage
              .then((hasSeenLogin) => {
                if (hasSeenLogin) {
                  this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
                    if (loggedInUserDetails === null) {
                      this.rootPage = LoginPage;
                    } else {
                      this.rootPage = HomeTabPage;
                    }
                  });
                } else {
                  this.rootPage = HomeTabPage;
                }
              });
          } else {
            this.rootPage = LoginPage;
          }
          this.platformReady()
        });


      this.datalink.hasLoggedIn().then((hasLoggedIn) => {
        this.storage.ready().then(() => {
          this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
            if (loggedInUserDetails == null) {
              this.rootPage = LoginPage;
            } else {
              this.Details = loggedInUserDetails[1];
              this.Userfullname = this.Details.lastname + " " + this.Details.firstname;
              this.usertype = this.Details.usertype;
              this.enableMenu(hasLoggedIn === true, this.usertype);
            }
          });
        });
      });
      this.listenToLoginEvents();
    });

  }

  platformReady() {
    this.platform.ready().then(() => {
      this.headerColor.tint('#ffffff');
      this.statusBar.show();
      this.keyboard.hideFormAccessoryBar(false);
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleBlackTranslucent()
      this.statusBar.backgroundColorByHexString("#000000");
      this.statusBar.styleLightContent();
      this.hideSplash();
      this.datalink.hasLoggedIn().then((hasLoggedIn) => {
        this.storage.ready().then(() => {
          this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
            if (loggedInUserDetails == null) {
              this.rootPage = LoginPage;
            } else {
              this.Details = loggedInUserDetails[1];
              this.Userfullname = this.Details.lastname + " " + this.Details.firstname;
              this.usertype = this.Details.usertype;
              this.enableMenu(hasLoggedIn === true, this.usertype);
            }
          });
        });
      });
    });
  }


  hideSplash() {
    setTimeout(() => {
      this.splashScreen.hide();
    }, 100)
  }

  listenToLoginEvents() {
    this.events.subscribe('user:signup', () => {
      this.enableMenu(true, "");
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false, "");
      // this.nav.setRoot(LoginPage);
    });

    this.events.subscribe('user:netwkerror', () => {
      this.enableMenu(false, "");
      // this.nav.setRoot(LoginPage);
    });

    this.events.subscribe('user:login', (usertype, Userfullname) => {
      this.Userfullname = Userfullname;
      this.enableMenu(true, usertype);
    })
  }

  enableMenu(showmenu, usertype) {
    if (usertype === "Member") {
      this.menu.enable(showmenu, 'loggedInUserMenu');
      this.menu.enable(!showmenu, 'loggedInAdminMenu');
      this.menu.enable(!showmenu, 'loggedOutMenu');
    } else if (usertype === "Admin") {
      this.menu.enable(showmenu, 'loggedInAdminMenu');
      this.menu.enable(!showmenu, 'loggedInUserMenu');
      this.menu.enable(!showmenu, 'loggedOutMenu');
    } else if (usertype === "Adviser") {
      this.menu.enable(showmenu, 'loggedInAdminMenu');
      this.menu.enable(!showmenu, 'loggedInUserMenu');
      this.menu.enable(!showmenu, 'loggedOutMenu');
    } else if (usertype === "") {
      this.menu.enable(!showmenu, 'loggedOutMenu');
      this.menu.enable(showmenu, 'loggedInAdminMenu');
      this.menu.enable(showmenu, 'loggedInUserMenu');
    }
  }



}

