import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ActionSheetController, ModalController, AlertController } from 'ionic-angular';
import { IComments } from '../../models/Interface';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { Storage } from '@ionic/storage';
import { EditCommentPage } from '../edit-comment/edit-comment';
import { ObjectTagsPage } from '../object-tags/object-tags';
import { BookMarksPage } from '../book-marks/book-marks';
import { ObjectSectionsPage } from '../object-sections/object-sections';
import { ObjectBooksPage } from '../object-books/object-books';

@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {
  bkcomments: IComments[];
  allbkcomments: IComments[];
  nobkcomments: any;
  bkcommentscount: any;
  originalbkcomments: any;
  error: any;
  firstCount = 0;
  bksubcomments: IComments[];
  allbksubcomments: IComments[];
  nobksubcomments: any;
  originalbksubcomments: any;
  parentid: any;
  parenttype: any;
  comment: { commenttext?: string } = {};

  UDetails: any;
  userid: string;
  constructor(public alertCtrl: AlertController, public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController, public storage: Storage, public datalink: DatalinkProvider, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
    this.parentid = this.navParams.get("parentid");
    this.parenttype = this.navParams.get("parenttype");
    this.getComments(this.parentid, this.parenttype);
  }

  ionViewDidLoad() {
    console.log(this.parentid);
    console.log(this.parenttype);
  }
  getComments(parentid, parenttype) {
    // if (this.network.type === "none") {
    //   this.getOfflineBkComments();
    // } else {
    this.getOnlineComments(parentid, parenttype);
    // }
  }

  getOnlineComments(parentid, parenttype) {
    let loading = this.loadingCtrl.create({
    });
    let firstCount = this.firstCount.toString();
    this.datalink.GetObjectComments(String(parentid), firstCount, parenttype).subscribe(comments => {
      if (comments[0] === "400") {
        this.error = comments[1];
        this.nobkcomments = "nobkcomments";
        loading.dismiss().catch(() => { });
      } else {
        this.bkcomments = comments[1];
        console.log(this.bkcomments);
        this.bkcommentscount = this.bkcomments.length;
        this.originalbkcomments = comments[1];
        this.nobkcomments = "full";
        loading.dismiss().catch(() => { });
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Error connecting to server");
      // this.getOfflineBkComments();
    });
  }


  SaveComment() {
    var commentContent = this.comment.commenttext;
    if (commentContent === "Type Comment Here" || commentContent === "" || commentContent === undefined) {
      this.datalink.showToast('bottom', "Please enter a comment");
      return false
    }

    // if (this.network.type === "none") {
    //   this.AddOfflinecomment(String(this.bookid), loadedType, commentContent);
    // } else {
    this.AddComment(String(this.parentid), this.parenttype, commentContent);
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
              this.getComments(loadedID, loadedType);
              this.comment.commenttext = "";
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

  likes(id) {
    var commenttype = "Likes";
    // if (this.network.type === "none") {
    //   this.UpdateOfflineCommentLikesAndDislikes(id, commenttype);
    // } else {
    this.UpdateCommentLikesAndDislikes(id, commenttype);
    // }
  }

  dislikes(id) {
    var commenttype = "Dislikes";
    // if (this.network.type === "none") {
    //   this.UpdateOfflineCommentLikesAndDislikes(id, commenttype);
    // } else {
    this.UpdateCommentLikesAndDislikes(id, commenttype);
    // }
  }

  UpdateCommentLikesAndDislikes(id, commenttype) {
    this.datalink.CommentLikesAndDislikes(id, commenttype).subscribe(commentsmsg => {
      if (commentsmsg == "success") {
        this.getOnlineComments(this.parentid, this.parenttype);
      } else {
        this.datalink.showToast('bottom', "Error something went wrong!");
      }
    }, (err) => {
      this.datalink.showToast('bottom', "Error connecting to server");
      return false;
    });
  }

  OpenCommentAction(commentid, comment) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Comment Options',
      buttons: [
        {
          text: 'View/Edit Comment',
          handler: () => {
            let profileModal = this.modalCtrl.create(EditCommentPage, { commentid, 
              comment, 
              parentid: this.parentid,
              parenttype: this.parenttype,
              optionText: "edit" });
            profileModal.present();
          }
        },
        {
          text: 'Reply Comment',
          handler: () => {
            let Modal = this.modalCtrl.create(EditCommentPage, { commentid, 
              parentid: this.parentid,
              parenttype: this.parenttype,
              comment, 
              optionText: "reply" });
            Modal.present();
          }
        },
        {
          text: 'Delete Comment',
          handler: () => {
            this.DeleteComment(this.parentid);
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


  DeleteComment(parentid) { 
    this.datalink.DeleteObjectComment(parentid, this.parenttype)
      .subscribe(success => {
        if (success == "successful") {
          this.datalink.showToast('bottom', "Successful");
          this.getComments(parentid, this.parenttype);
        } else {
          this.datalink.showToast('bottom', "Error something went wrong");
        }
      }, err => {
        this.datalink.showToast('bottom', "Error connecting to server");
      })
  }

  replies(commentid){
    this.getComments(commentid, "Comment");
  }

  onOpenTags(commentid) {
    this.navCtrl.push(ObjectTagsPage, { parentid: commentid, parenttype: "Comment" });
  }
  onOpenBookMarks(commentid) {
    this.navCtrl.push(BookMarksPage, { parentid: commentid, parenttype: "Comment" });
  }
  onOpenTag(commentid) {
    this.navCtrl.push(ObjectTagsPage, { parentid: commentid, parenttype: "Comment" });
  }
  onOpenSections(commentid) {
    this.navCtrl.push(ObjectSectionsPage, { parentid: commentid, parenttype: "Comment" });
  }
  onOpenBooks(commentid) {
    this.navCtrl.push(ObjectBooksPage, { parentid: commentid, parenttype: "Comment" });
  }
}
