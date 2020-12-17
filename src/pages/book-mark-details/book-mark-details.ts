import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { Storage } from '@ionic/storage';
import { IClips } from '../../models/Interface';
import { CommentsPage } from '../comments/comments';
import { ObjectIndexesPage } from '../object-indexes/object-indexes';
import { ObjectTagsPage } from '../object-tags/object-tags';

@Component({
  selector: 'page-book-mark-details',
  templateUrl: 'book-mark-details.html',
})
export class BookMarkDetailsPage {
  bkmkId:any;
  bkmkTxt:any;
  bkmkdetails: IClips;
  constructor(public datalink: DatalinkProvider,
    public loadingCtrl: LoadingController,
    public storage: Storage, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.bkmkId = this.navParams.get('bkmkId');
    this.bkmkTxt = this.navParams.get('bkmkTxt');
    
    this.getBkMkDetails(this.bkmkId)
  }

  ionViewDidLoad() {
  
  }
  onClose(){
    this.viewCtrl.dismiss();
  }

  getBkMkDetails(bkmkId) {
    // if (this.network.type === "none") {
    //   this.getOfflineSectComments();
    // } else {
    this.getOnlineBkMkDetails(bkmkId);
    // }
  }

  getOnlineBkMkDetails(bkmkId) {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.GetClipDetails(String(bkmkId)).subscribe(bkmkdetails => {
      console.log(bkmkdetails);
      loading.dismiss().catch(() => { });
      this.bkmkdetails = bkmkdetails;
    }, (err) => {
      this.datalink.showToast('bottom', "Error connecting to server");
      loading.dismiss().catch(() => { });
      // this.offlineBkDetails(id);
    });
  }
  onOpenComments() {
    this.navCtrl.push(CommentsPage, { parentid: this.bkmkId, parenttype: "Clip" });
  }
  onOpenIndex() {
    this.navCtrl.push(ObjectIndexesPage, { parentid: this.bkmkId, parenttype: "Clip" });
  }
  onOpenTags() {
    this.navCtrl.push(ObjectTagsPage, { parentid: this.bkmkId, parenttype: "Clip" });
  }
}
