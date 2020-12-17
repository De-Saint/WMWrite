import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-edit-comment',
  templateUrl: 'edit-comment.html',
})
export class EditCommentPage {
  commentid: any;
  commenttext: any;
  optionText: any;
  userid: any;
  params: Object;
  pushPage: any;
  parentid: any;
  parenttype: any;
  comment: { commentText?: string } = {};
  constructor(public datalink: DatalinkProvider,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.commentid = this.navParams.get("commentid");
    this.commenttext = this.navParams.get("comment");
    this.optionText = this.navParams.get("optionText");
    this.parentid = this.navParams.get("parentid");
    this.parenttype = this.navParams.get("parenttype");
  }
  UDetails: any;
  ionViewDidLoad() {

  }
  onClose() {
    this.viewCtrl.dismiss();
  }
  onUpdate() {
    var commentcontent = document.getElementById("CommentCont").innerText;
    this.datalink.UpdateComment(String(this.commentid), commentcontent).subscribe(success => {
      if (success === "success") {
        this.datalink.showToast("bottom", "Successful");
        this.onClose();
      } else {
        this.datalink.showToast("bottom", "Something went wrong, please try again" );
      }
    }, err => {
      this.datalink.showToast('bottom', "Error connecting to server");
    });

  }
  onReply() {
    var commentContent = this.comment.commentText;
    if (commentContent === "Type Comment Here" || commentContent === "" || commentContent === undefined) {
      this.datalink.showToast('bottom', "Please enter a comment");
      return false
    }
    var loadedType = "Comment";
    // if (this.network.type === "none") {
    //   this.AddOfflinecomment(String(subCommentid), loadedType, commentContent);
    // } else {
    this.AddComment(String(this.commentid), loadedType, commentContent);
    // }
  }

  AddComment(loadedID, loadedType, comment) {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userId;
  
          this.datalink.AddComment(loadedID, loadedType, comment, String(this.userid)).subscribe(msg => {
            if (msg === "failed") {
              this.datalink.showToast('bottom', "Error something went wrong");
              loading.dismiss().catch(() => { });
            } else {
              this.datalink.showToast('bottom', "Successful");
              this.onClose();
              loading.dismiss().catch(() => { });
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

}
