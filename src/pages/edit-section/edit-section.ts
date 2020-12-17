import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, LoadingController, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { CommentsPage } from '../comments/comments';
import { BookMarkDetailsPage } from '../book-mark-details/book-mark-details';
import { AddIndexPage } from '../add-index/add-index';
import { AddTagPage } from '../add-tag/add-tag';


@Component({
  selector: 'page-edit-section',
  templateUrl: 'edit-section.html',
})
export class EditSectionPage {
  @ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
  @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;
  @ViewChild('model', { read: ElementRef }) model: ElementRef;

  sectionid: any;
  firstCount = 0;
  section: any;
  userid: string;
  UDetails: any;
  clipid: any;
  bookmarkid: any;
  bookmarktext: any;
  latestversion: any;
  // sectionContent: any;
  constructor(public loadingCtrl: LoadingController,
    public datalink: DatalinkProvider,
    public storage: Storage,
    public actionSheetCtrl: ActionSheetController,
    public sanitizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams) {
    this.section = this.navParams.get("section");
    this.sectionid = this.section.id;
    this.latestversion = this.section.latestVersion;

  }

  ionViewDidLoad() {
    console.log(this.section);

  }
  ionViewWillLeave() {
    this.onSave();
  }
  ionViewDidLeave() {

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


  AddBookMark() {
    let theselected = "";
    let loading = this.loadingCtrl.create({
    });

    if (window.getSelection) {
      theselected = window.getSelection().toString();
      if (theselected.length === 0) {
        this.datalink.showToast("bottom", "Please select text to bookmark");
        return false;
      } else {

        var selection = window.getSelection().getRangeAt(0);
        var selectedText = selection.extractContents();
        var parentspan = document.createElement("span");
        parentspan.style.backgroundColor = "yellow";
        parentspan.className = "bookmarked highlight";
        parentspan.appendChild(selectedText);
        let sectionid = this.sectionid;
        this.storage.ready().then(() => {
          this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
            if (loggedInUserDetails == null) {
            } else {
              this.UDetails = loggedInUserDetails[1];
              this.userid = this.UDetails.userId;
              // if (this.network.type === "none") {
              //   var clipID = this.dataservice.generateId();
              //   var Date = this.dataservice.getDate;
              //   this.dataservice.setClips(clipID, sectionid, "Section", this.userid.toString(), Date);
              //   this.clipid = clipID;
              //   var childspan = document.createElement("span");
              //   childspan.id = "bookmarkid";
              //   childspan.className = "hide";
              //   childspan.innerText = this.clipid;
              //   parentspan.appendChild(childspan);
              //   selection.insertNode(parentspan);
              //   this.Save();
              // } else {
              loading.present();
              this.datalink.Postclip(sectionid, "Section", String(this.userid), String(theselected)).subscribe(clipid => {
                loading.dismiss().catch(() => { });
                this.clipid = clipid;
                var childspan = document.createElement("span");
                childspan.className = "bookmarkid hide";
                childspan.innerText = this.clipid;
                parentspan.appendChild(childspan);
                selection.insertNode(parentspan);
                this.onSave();
              });
              //}
            }
          });
        });
      }
    }
  }

  onSave() {
    var sectnName = document.getElementById("sectionName").innerText;
    let sectnContent = document.getElementById("model").innerHTML;
    // if (this.network.type === "none") {
    //   var lastupdated = this.dataservice.getDate();
    //   this.dataservice.updateSectionContent(this.sectionid, sectnContent, lastupdated);
    //   this.datalink.showToast('buttom', "Successful");
    //   let bookid = this.bookid;
    //   this.navCtrl.setRoot(BookSectionsPage, { bookid });
    // } else {

    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.UpdateOnlineSection(this.sectionid, 0, sectnName, sectnContent, String(this.latestversion), loading);
    //  }
  }
  UpdateOnlineSection(sectionid, count, sectnName, sectnContent, latestversion, loading) {
    var done = "no";
    var x = 5000;
    var weight = sectnContent.length;
    if (weight < x) {
      x = weight;
    }
    var currentContent = sectnContent.substr(count, x);
    count = count + currentContent.length;
    var next = sectnContent.substr(count, count + x);
    if (next === "") {
      done = "yes";
    }
    this.UpdateSection(sectionid, sectnName, currentContent, latestversion, count, done, sectnContent, loading);
  }
  UpdateSection(sectionid, sectnName, currentContent, latestversion, count, done, sectnContent, loading) {
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userId;
          this.datalink.UpdateSection(sectionid, sectnName, currentContent, done, this.userid, latestversion).subscribe(msg => {
            let message = msg;
            if (message[1] === "finished") {
              this.datalink.showToast('bottom', "Check-In and Save Section Successful");
              loading.dismiss().catch(() => { });
            } else if (message[1] === "failed") {
              this.datalink.showToast('bottom', "Error something went wrong");
              loading.dismiss().catch(() => { });
            } else {
              this.UpdateOnlineSection(sectionid, count, sectnName, sectnContent, latestversion, loading)
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
}
