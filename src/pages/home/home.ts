import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform, AlertController } from 'ionic-angular';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { Storage } from '@ionic/storage';
import { AppVersion } from '@ionic-native/app-version';
import { Market } from '@ionic-native/market';
import { IBooks } from '../../models/Interface';
import { BookDetailsPage } from '../book-details/book-details';
import { ObjectTagsPage } from '../object-tags/object-tags';
import { ObjectIndexesPage } from '../object-indexes/object-indexes';
import { CommentsPage } from '../comments/comments';
import { SectionDisplayPage } from '../section-display/section-display';
import { NewBookPage } from '../new-book/new-book';
import { SearchPage } from '../search/search';
import { CategoryPage } from '../category/category';
import { LibraryPage } from '../library/library';
import { NewIndexPage } from '../new-index/new-index';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  rootNavCtrl: NavController;
  books: IBooks[];
  username: any;
  id: any;
  nobooks: any;
  bookcount: any;
  error: any;
  check: boolean = false;
  originalbooks: any;
  appversion: any;
  constructor(public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public platform: Platform, public market: Market,
    public appVersion: AppVersion,
    public datalink: DatalinkProvider, public storage: Storage, public navCtrl: NavController, public navParams: NavParams) {
    this.rootNavCtrl = this.navParams.get('rootNavCtrl');

  }

  ionViewWillEnter() {
    this.getVersionNumber();
  } 


  GetBooks(filter, appversion) {
    let loading = this.loadingCtrl.create({
    });
    // loading.present();
    let firstCount = "0";
    var search = "";
    this.datalink.GetBooks(firstCount, search, filter).subscribe(books => {
      loading.dismiss().catch(() => { });
      let serverAppVAndroid = books[2];
      let serverAppViOS = books[3];
      if (appversion === serverAppVAndroid || appversion === serverAppViOS) {
        if (books[0] === "400") {
          this.error = books[1];
          this.nobooks = "nobooks";
        } else {
          this.books = books[1];
          this.bookcount = this.books[0].count;
          this.originalbooks = books[1];
          console.log(this.books);
        }
      } else {
        this.UpdateVersion();
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Error connecting to the server");
      return false;
    });
  }

  OpenBook(bookid) {
    this.navCtrl.push(BookDetailsPage, { bookid });
  }

  async getVersionNumber() {
    // const versionNumber = await this.appVersion.getVersionNumber();
    // this.GetBooks("Recent", versionNumber)
    this.GetBooks("Recent", "0.0.1");

  }

  UpdateVersion() {
    const confirm = this.alertCtrl.create({
      title: 'Update Available',
      message: 'A new version of The WealthMarket Write Mobile App is available. Please update to a version now.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Update Now!',
          handler: () => {
            this.onUpdateNow();
          }
        }
      ]
    });
    confirm.present();
  }


  onUpdateNow() {
    this.platform.ready().then(() => {
      let appID;
      if (this.platform.is('ios')) {
        appID = "23233444334";
        this.market.open(appID);
      } else if (this.platform.is('andriod')) {
        appID = "com.thewealthmarket.wmwrite";
        this.market.open(appID);
      }
    })

  }
  onOpenTags(bookid) {
    this.navCtrl.push(ObjectTagsPage, { parentid: bookid, parenttype: "Book" });
  }
  onOpenIndex(bookid) {
    this.navCtrl.push(ObjectIndexesPage, { parentid: bookid, parenttype: "Book" });
  }
  onOpenComments(bookid) {
    this.navCtrl.push(CommentsPage, { parentid: bookid, parenttype: "Book" });
  }
  onOpenSections(bookid) {
    this.navCtrl.push(SectionDisplayPage, { bookid: bookid });
  }




  onNewBook() {
    this.rootNavCtrl.push(NewBookPage);
  }
  onSearch() {
    this.rootNavCtrl.push(SearchPage);
  }

  onLibrary() {
    this.rootNavCtrl.push(LibraryPage);
  }
  onCreateIndex() {
    this.rootNavCtrl.push(NewIndexPage, { indextype: "newIndex" });
  }


  onCategory() {
    this.rootNavCtrl.push(CategoryPage);
  }
}
