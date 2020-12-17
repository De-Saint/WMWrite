import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, ActionSheetController, Content, Events, AlertController } from 'ionic-angular';
import { TableOfContentsPage } from '../table-of-contents/table-of-contents';
import { ISections } from '../../models/Interface';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { EditSectionPage } from '../edit-section/edit-section';
import { AddTagPage } from '../add-tag/add-tag';
import { CommentsPage } from '../comments/comments';
import { NewSectionPage } from '../new-section/new-section';
import { BookMarksPage } from '../book-marks/book-marks';
import { AddIndexPage } from '../add-index/add-index';
import { ObjectIndexesPage } from '../object-indexes/object-indexes';
import { ObjectTagsPage } from '../object-tags/object-tags';
import { BookMarkDetailsPage } from '../book-mark-details/book-mark-details';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-section-display',
  templateUrl: 'section-display.html',
})
export class SectionDisplayPage {
  bookid: any;
  error: any;
  nosection: any;
  booksections: ISections[];
  firstCount = 0;
  nobksection: any;
  rootNavCtrl: NavController;
  scrollvalue: any;
  userid: any;
  UDetails: any;
  @ViewChild(Content) content: Content;
  @ViewChild(Content) cardscroll: Content
  constructor(public loadingCtrl: LoadingController,
    public events: Events, public storage: Storage,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public datalink: DatalinkProvider, public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams) {
    this.bookid = this.navParams.get("bookid");
    this.getBookSections(this.bookid);
    this.rootNavCtrl = this.navParams.get('rootNavCtrl');
    this.listenToLoginEvents();
  }

  ionViewDidLoad() {

  }
  getBookSections(bookid) {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.GetBookSections(String(bookid)).subscribe(booksections => {
      if (booksections[0] !== "200") {
        this.error = booksections[1];
        this.nobksection = "nobksection";
        loading.dismiss().catch(() => { });
      } else {
        this.booksections = booksections[1];
        loading.dismiss().catch(() => { });
        if (this.scrollvalue) {
          this.scrollInView(this.scrollvalue);
        }
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Error connecting to server");
    });

  }

  onTOContents() {
    let modal = this.modalCtrl.create(TableOfContentsPage, { bookid: this.bookid });
    modal.present();
  }
  onOpenBookMark(sectionid) {
    this.navCtrl.push(BookMarksPage, { parentid: sectionid, parenttype: "Section" });
  }
  onOpenComments(sectionid) {
    this.navCtrl.push(CommentsPage, { parentid: sectionid, parenttype: "Section" });
  }
  onOpenIndex(sectionid) {
    this.navCtrl.push(ObjectIndexesPage, { parentid: sectionid, parenttype: "Section" });
  }
  onOpenTags(sectionid) {
    this.navCtrl.push(ObjectTagsPage, { parentid: sectionid, parenttype: "Section" });
  }

  onSectionOption(sectionid, section) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Section Options',
      buttons: [
        {
          text: 'Check-Out And Edit Section',
          handler: () => {
            this.onCheckAvailability(sectionid, section);
          }
        },
        {
          text: 'Add Sub-Section',
          handler: () => {
            this.navCtrl.push(NewSectionPage, { parentid: sectionid, parenttype: "Section" });
          }
        },
        {
          text: 'Add Comment',
          handler: () => {
            this.navCtrl.push(CommentsPage, { parentid: sectionid, parenttype: "Section" });
          }
        },
        {
          text: 'Add Tag',
          handler: () => {
            this.navCtrl.push(AddTagPage, { parentid: sectionid, parenttype: "Section" });
          }
        },
        {
          text: 'Add Index',
          handler: () => {
            this.navCtrl.push(AddIndexPage, { parentid: sectionid, parenttype: "Section" });
          }
        },
        {
          text: 'Promote Section',
          handler: () => {
            this.Promote(sectionid);
          }
        },
        {
          text: 'Demote Section',
          handler: () => {
            this.Demote(sectionid);
          }
        },
        // {
        //   text: 'Save Offline',
        //   handler: () => {
        //     this.SaveOffline(sectionid);
        //   }
        // },
        // {
        //   text: 'Sync Section',
        //   handler: () => {

        //   }
        // },

        {
          text: 'Move Section Up',
          handler: () => {
            this.MoveUp(sectionid);
          }
        },
        {
          text: 'Move Section Down',
          handler: () => {
            this.MoveDown(sectionid);
          }
        },
        {
          text: 'Delete Section',
          handler: () => {
            this.Delete(sectionid);
          }
        },
        {
          text: 'Close',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });

    actionSheet.present();
  }



  Promote(sectionid) {
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Promte Section',
      message: 'Do you want to Promote this Section?',
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
            loading.present();
            this.datalink.promoteSection(sectionid).subscribe(msg => {
              if (msg === "Success") {
                this.datalink.showToast('bottom', "Successful");
                loading.dismiss().catch(() => { });
                this.getBookSections(this.bookid);
              } else {
                this.datalink.showToast('bottom', "Error something went wrong");
                loading.dismiss().catch(() => { });
              }
            }, (err) => {
              loading.dismiss().catch(() => { });
              this.optionInfo();
              return false;
            });
          }
        }
      ]
    });
    confirm.present();
  }
  Demote(sectionid) {
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Demote Section',
      message: 'Do you want to Demote this Section?',
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
            loading.present();
            this.datalink.demoteSection(sectionid).subscribe(msg => {
              if (msg === "Success") {
                this.datalink.showToast('bottom', "Successful");
                loading.dismiss().catch(() => { });
                this.getBookSections(this.bookid);
              } else {
                this.datalink.showToast('bottom', "Error");
                loading.dismiss().catch(() => { });
              }
            }, (err) => {
              loading.dismiss().catch(() => { });
              this.optionInfo();
              return false;
            });
          }
        }
      ]
    });
    confirm.present();
  }



  MoveUp(sectionid) {
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Move Section Up',
      message: 'Do you want to Move this Section Up?',
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
            loading.present();
            this.datalink.SwapSection(sectionid, "Up").subscribe(msg => {
              if (msg === "Success") {
                this.datalink.showToast('bottom', "Successful");
                this.getBookSections(this.bookid);
              } else {
                this.datalink.showToast('bottom', "Error something went wrong");
                loading.dismiss().catch(() => { });
              }
            }, (err) => {
              loading.dismiss().catch(() => { });
              this.optionInfo();
              return false;
            });
          }
        }
      ]
    });
    confirm.present();
  }
  MoveDown(sectionid) {
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Move Section Down',
      message: 'Do you want to Move this Section Down?',
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
            loading.present();
            this.datalink.SwapSection(sectionid, "Down").subscribe(msg => {
              if (msg === "Success") {
                this.datalink.showToast('bottom', "Successful");
                this.getBookSections(this.bookid);
              } else {
                this.datalink.showToast('bottom', "Error something went wrong");
                loading.dismiss().catch(() => { });
              }
            }, (err) => {
              loading.dismiss().catch(() => { });
              this.optionInfo();
              return false;
            });
          }
        }
      ]
    });
    confirm.present();
  }
  Delete(sectionid) {
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Delete Section',
      message: 'Are you sure you want to Delete this Section?',
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
            loading.present();
            this.datalink.DeleteSection(sectionid).subscribe(msg => {
              if (msg === "successful") {
                this.datalink.showToast('bottom', "Successful");
                this.getBookSections(this.bookid);
              } else {
                this.datalink.showToast('bottom', "Error something went wrong");
                loading.dismiss().catch(() => { });
              }
            }, (err) => {
              loading.dismiss().catch(() => { });
              this.optionInfo();
              return false;
            });
          }
        }
      ]
    });
    confirm.present();
  }


  SaveOffline(sectionid) {

  }

  scrollInView(elementid) {
    var element = "section_" + elementid;
    let el = document.getElementById(element);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      let yOffset = document.getElementById(element).offsetTop;
      try {
        this.cardscroll.scrollTo(0, yOffset, 8000);
      } catch (e) { }

    }
  }


  listenToLoginEvents() {
    this.events.subscribe('section:toc', (scrollvalue, bookid) => {
      this.bookid = bookid;
      this.scrollvalue = scrollvalue;
      this.getBookSections(bookid);
    })
  }

  optionInfo() {
    this.datalink.showToast('bottom', "Please reconnect to perform this action");
  }
  checkBookmark($event: any) {
    let cn = $event.target.classList;
    let bkText = "'" + $event.target.innerText + "'";
    if (cn.contains("bookmarked")) {
      let bkid = $event.target.getElementsByClassName("bookmarkid")[0].innerHTML;
      this.BookmarkOptions(bkid, bkText);
    }
  }

  BookmarkOptions(bkmkId, bkmkTxt) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Bookmark Options',
      buttons: [
        {
          text: "View Details",
          handler: () => {
            this.navCtrl.push(BookMarkDetailsPage, { bkmkId, bkmkTxt });

          }
        },
        {
          text: "Add Comment",
          handler: () => {
            this.navCtrl.push(CommentsPage, {
              parentid: bkmkId,
              parenttype: "Clip",
            });
          }
        },
        {
          text: "Add Tag",
          handler: () => {
            this.navCtrl.push(AddTagPage, {
              parentid: bkmkId,
              parenttype: "Clip"
            });
          }
        },
        {
          text: "Add Index",
          handler: () => {
            this.navCtrl.push(AddIndexPage, {
              parentid: bkmkId,
              parenttype: "Clip",
            });
          }
        },
        {
          text: 'Close',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });

    actionSheet.present();
  }
  onCheckAvailability(sectionid, section) {
    // if (this.network.type === "none") {
    //   loading.dismiss().catch(() => { });
    //   this.dataservice.getOfflineSectionDetails(id).then((result) => {
    //     if (result.res.rows.length > 0) {
    //       this.section = result.res.rows[0];
    //     } else {
    //       this.datalink.showToast('bottom', "Error");
    //     }
    //   });
    // } else {
    let loading = this.loadingCtrl.create({
      content: 'Checking-In'
    });
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userId;
          loading.present();
          this.datalink.CheckSectionAvailability(String(this.userid), String(sectionid)).subscribe(result => {
            if (String(result) === "true") {
              this.datalink.showToast("button", String(result));
              return false;
            } else {
              this.navCtrl.push(EditSectionPage, { section });
            }
            loading.dismiss().catch(() => { });
          });
        }
      });
    });
    //}
  }
}
