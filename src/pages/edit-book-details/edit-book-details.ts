import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DatalinkProvider } from '../../providers/datalink/datalink';

@Component({
  selector: 'page-edit-book-details',
  templateUrl: 'edit-book-details.html',
})
export class EditBookDetailsPage {
  bookid: any;
  book: any;
  userid: string;
  UDetails: any;
  clipid: any;
  constructor(public loadingCtrl: LoadingController,
    public datalink: DatalinkProvider,
    public storage: Storage, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.bookid = this.navParams.get("bookid");
    this.book = this.navParams.get("bookdetails");
    
  }

  ionViewDidLoad() {

  }
  onClose() {
    this.viewCtrl.dismiss();
  }

  onSave() {
    var title = document.getElementById("BOOKTitle").textContent;
    if(title === "" || title === undefined ){
      return false;
    }
    var summary = document.getElementById("BOOKSummary").textContent;
    if(summary === "" || summary === undefined ){
      return false;
    }
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    loading.dismiss().catch(() => { });
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userId;
          this.datalink.UpdateBookDetail(String(this.userid), String(this.bookid), title, summary).subscribe(msg => {
            loading.dismiss().catch(() => { });
            let code = msg[0];
            if (code === "failed") {
              this.datalink.showToast('bottom', "Error something went wrong");
            } else {
              this.datalink.showToast('bottom', "Successful");
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
