import { Component } from '@angular/core';
import {  NavController, NavParams, LoadingController } from 'ionic-angular';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { ObjectTagsPage } from '../object-tags/object-tags';
import { BookMarksPage } from '../book-marks/book-marks';
import { CommentsPage } from '../comments/comments';
import { ObjectSectionsPage } from '../object-sections/object-sections';
import { ObjectBooksPage } from '../object-books/object-books';


@Component({
  selector: 'page-tag-details',
  templateUrl: 'tag-details.html',
})
export class TagDetailsPage {
  tagdetails:any;
  tagid:any;
  constructor(public loadingCtrl: LoadingController,
    public datalink: DatalinkProvider,
    public navCtrl: NavController, public navParams: NavParams) {
      this.tagdetails = navParams.get("tagdetails");
      this.tagid = this.tagdetails.id;
  }

  ionViewDidLoad() {
    
  }

  onSave() {
    var tagname = document.getElementById("tagname").innerText;
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    if (tagname == '') {
      this.datalink.showToast('buttom', "Supply a Tag Name");
      return false;
    } else {
      // if (this.network.type === "none") {
      //   this.dataservice.updateTagName(tagid, tagname);
      //   this.datalink.showToast('buttom', 'Successful');
      //   this.GetTags();
      // } else {
      this.datalink.UpdateTag(String(this.tagid), tagname).subscribe(msg => {
        let code = msg[0];
        if (code === "failed") {
          loading.dismiss().catch(() => { });
          this.datalink.showToast('bottom', "Error something went wrong");
        } else {
          loading.dismiss().catch(() => { });
          this.datalink.showToast('bottom', "Successful");
        }
        this.navCtrl.pop();
      }, (err) => {
        loading.dismiss().catch(() => { });
        this.datalink.showToast('bottom', "Error connecting to server");
        return false;
      });
    }
  }

  onOpenTags() {
    this.navCtrl.push(ObjectTagsPage, { parentid: this.tagid, parenttype: "Tag" });
  }
  onOpenBookMarks() {
    this.navCtrl.push(BookMarksPage, { parentid: this.tagid, parenttype: "Tag" });
  }
  onOpenComments() {
    this.navCtrl.push(CommentsPage, { parentid: this.tagid, parenttype: "Tag" });
  }
  onOpenSections() {
    this.navCtrl.push(ObjectSectionsPage, { parentid: this.tagid, parenttype: "Tag" });
  }
  onOpenBooks() {
    this.navCtrl.push(ObjectBooksPage, { parentid: this.tagid, parenttype: "Tag" });
  }
}