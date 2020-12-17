import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { WmObjectsPage } from '../wm-objects/wm-objects';
import { ProfilePage } from '../profile/profile';
import { SuperTabs} from 'ionic2-super-tabs';
import { Storage } from '@ionic/storage';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { NewBookPage } from '../new-book/new-book';
import { CategoryPage } from '../category/category';


@Component({
  selector: 'page-home-tab',
  templateUrl: 'home-tab.html',
})
export class HomeTabPage {
  pages = [
    { pageName: HomePage, title: 'Home', icon: 'home', id: 'homeTab' },
    { pageName: CategoryPage, title: 'Category', icon: 'albums', id: 'categoryTab' },
    { pageName: NewBookPage, title: 'New', icon: 'add-circle', id: 'newBookTab' },
    { pageName: WmObjectsPage, title: 'Objects', icon: 'folder', id: 'wmobjectTab' },
    { pageName: ProfilePage, title: 'Profile', icon: 'contact', id: 'profileTab' }
  ];

  selectedTab = 0;

  @ViewChild(SuperTabs) superTabs: SuperTabs;
  constructor( public datalink: DatalinkProvider, public storage: Storage, 
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
   
  }

  onTabSelect(ev: any) {
    this.selectedTab = ev.index;
  }
  
}
