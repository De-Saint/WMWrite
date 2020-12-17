import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, LoadingController } from 'ionic-angular';
import { IClips } from '../../models/Interface';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { BookMarkDetailsPage } from '../book-mark-details/book-mark-details';


@Component({
  selector: 'page-book-marks',
  templateUrl: 'book-marks.html',
})
export class BookMarksPage {
  @ViewChild(Content) content: Content;
  bkmks: IClips[];
  code: any;
  nobkmks: any;
  error: any;
  allbkmks: IClips[];
  bkmkscount: string;
  bkmkcount: string;
  originalbkmks: any;
  firstCount = 0;
  count: string;
  searchTerm: string = '';

  parentid: any;
  parenttype: any;
  constructor(public datalink: DatalinkProvider,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController, public navParams: NavParams) {

    this.parentid = this.navParams.get("parentid");
    this.parenttype = this.navParams.get("parenttype");
    this.ObjectClips(this.parentid, this.parenttype);
  }

  ionViewDidLoad() {
    console.log(this.parentid);
    console.log(this.parenttype);
  }
  ObjectClips(parentid, parenttype) {
    // if (this.network.type === "none") {
    //   this.getOfflineBookTags(this.bookid);
    // } else {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.getObjectClips(parentid, String(this.firstCount), parenttype).subscribe(bkmks => {
      if (bkmks[0] !== "200") {
        this.error = bkmks[1];
        this.nobkmks = "nobkmks";
        loading.dismiss().catch(() => { });
      } else {
        this.bkmks = bkmks[1];
        this.bkmkscount = this.bkmks[0].count;
        this.originalbkmks = bkmks[1];
        console.log(this.bkmks);
        loading.dismiss().catch(() => { });
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Error connecting to server");
      // this.getOfflineBookTags(this.bookid);
    });
    //}
  }
  openBkMkOption(bkmkId, bkmkTxt) {
    this.navCtrl.push(BookMarkDetailsPage, { bkmkId, bkmkTxt });
  }

  LoadMore(infiniteScroll) {
    // if (this.network.type === "none") {
    // } else {
    setTimeout(() => {
      if (this.bkmkscount === null || this.bkmkscount === undefined) {
        infiniteScroll.complete();
        infiniteScroll.enable(false);
        return false;
      } else {
        let tc = parseInt(this.bkmkscount);
        this.firstCount += tc;
        this.datalink.getObjectClips(this.parentid, String(this.firstCount), this.parenttype).subscribe(newbkmks => {
          if (newbkmks[0] !== "200") {
            this.error = newbkmks[1];
            this.nobkmks = 'none';
            infiniteScroll.complete();
            infiniteScroll.enable(false);
          } else {
            this.bkmks = [];
            this.bkmks = this.originalbkmks.concat(newbkmks[1]);
            infiniteScroll.complete();
          }
        }, (err) => {
          infiniteScroll.complete();
          infiniteScroll.enable(false);
          return false;
        });
      }
      infiniteScroll.complete();
    }, 2000);
    // }
  }

  LoadLess() {
    this.content.scrollToTop(1000);
  }
}
