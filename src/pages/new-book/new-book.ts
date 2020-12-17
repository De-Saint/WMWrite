import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { Storage } from '@ionic/storage';
import { BookDetailsPage } from '../book-details/book-details';


@Component({
  selector: 'page-new-book',
  templateUrl: 'new-book.html',
})
export class NewBookPage {
  rootNavCtrl: NavController;
  userid: string;
  bookid: any;
  sectionid: any;
  UDetails: any;
  bookcategory: any;
  bk: {
    bkoption?: string,
    bkcat?: string,
    bktitle?: string,
    bksummary?: string
    sntitle?: string
    sncontent?: string
  } = {};
  constructor(
    public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    public datalink: DatalinkProvider, public storage: Storage, public toastCtrl: ToastController,
    public navCtrl: NavController, public navParams: NavParams) {
    this.getBookCategory();
    this.rootNavCtrl = this.navParams.get('rootNavCtrl');
  }


  getBookCategory() {
    this.datalink.getBookCategory().subscribe(bookcategory => {
      this.bookcategory = bookcategory;
    }, (err) => {
      return false;
    });
  }

  onSave() {
    var bktitle = this.bk.bktitle;
    var bksummary = this.bk.bksummary;
    var sectiontitle = this.bk.sntitle;
    var sectioncontent = this.bk.sncontent;
    var bkoption = this.bk.bkoption;
    var bkcat = this.bk.bkcat;
    if (bktitle === "Title" || bktitle === "" || bktitle === "Enter your book title here") {
      this.datalink.showToast('bottom', "Error please type book title");
      return false
    }
    if (bksummary === "Summary" || bksummary === "" || bksummary === "Enter your book summary here") {
      this.datalink.showToast('bottom', "Error please type book summary");
      return false
    }
    if (bkcat === "" || bkcat === null || bkcat === undefined) {
      this.datalink.showToast('bottom', "Error please select a category");
      return false
    }
    if (bkoption === "" || bkoption === null || bkoption === undefined) {
      this.datalink.showToast('bottom', "Error please select an option");
      return false
    }
    if (sectiontitle === "Type your section title here" || sectiontitle === "") {
      this.datalink.showToast('bottom', "Please fill section title");
      return false
    }
    if (sectioncontent === "Type your section content here" || sectioncontent === "") {
      this.datalink.showToast('bottom', "Please fill section content");
      return false
    }
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userId;
          let loading = this.loadingCtrl.create({
          });
          loading.present();
          this.SaveBookOnline(String(this.userid), bktitle, bksummary, String(bkcat), loading, String(bkoption), sectiontitle, sectioncontent);
        }
      });
    });

  }


  SaveBookOnline(userid, bktitle, bksummary, bkcategory, loading, isArticle, sectiontitle, sectioncontent) {
    this.datalink.CreateBook(userid, bktitle, bksummary, bkcategory, isArticle).subscribe(newbookid => {
      let bookid = newbookid;
      if (bookid !== "0" || bookid !== 0) {
        loading.dismiss().catch(() => { });
        this.onSaveSection(String(bookid), "Book", sectiontitle, sectioncontent);
      } else {
        loading.dismiss().catch(() => { });
        this.datalink.showToast('bottom', "Error something went wrong while creating the book, please try again");
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Error connecting to server");
      return false;
    });
  }

  onSaveSection(parentid, parenttype, sectiontitle, sectioncontent) {
    var timestamp = new Date().getMilliseconds().toString();
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.SaveOnlineSection(timestamp, 0, sectiontitle, sectioncontent, parenttype, String(parentid), loading);
  }

  SaveOnlineSection(random, count, sectionTitle, content, loadedType, LoadedID, loading) {
    var done = "no";
    var x = 5000;
    var weight = content.length;
    if (weight < x) {
      x = weight;
    }
    var currentContent = content.substr(count, x);
    count = count + currentContent.length;
    var next = content.substr(count, count + x);
    if (next === "") {
      done = "yes";
    }
    this.AddSection(LoadedID, loadedType, sectionTitle, currentContent, random, count, done, content, loading);
  }
  AddSection(LoadedID, loadedType, sectionTitle, currentContent, random, count, done, content, loading) {
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
          return false;
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userId;
          this.datalink.AddSection(LoadedID, loadedType, sectionTitle, currentContent, random, String(count), done, this.userid).subscribe(msg => {
            let message = msg;
            if (message[1] === "finished") {
              this.datalink.showToast('bottom', "Book has been created successfully");
              loading.dismiss().catch(() => { });
              this.navCtrl.push(BookDetailsPage, { bookid: LoadedID });
            } else if (message[1] === "failed") {
              this.datalink.showToast('bottom', "Error something went wrong");
              loading.dismiss().catch(() => { });
            } else {
              this.SaveOnlineSection(random, count, sectionTitle, content, loadedType, LoadedID, loading)
            }
          }, (err) => {
            loading.dismiss().catch(() => { });
            this.datalink.showToast('bottom', "Error connecting to server");
            return false;
          });
        }
      });
    });

  }
  Bold() {
    document.execCommand('bold');
  }
  Italic() {
    document.execCommand('italic');

  }
  Underline() {
    document.execCommand('underline');
  }
  Erase() {
    document.execCommand('removeFormat');
  }
  Undo() {
    document.execCommand('undo');
  }
  Redo() {
    document.execCommand('redo');
  }
  Center() {
    document.execCommand('justifyCenter');
  }
  Justify() {
    document.execCommand('justifyFull');
  }
  Left() {
    document.execCommand('justifyLeft');
  }
  Right() {
    document.execCommand('justifyRight');
  }
}
