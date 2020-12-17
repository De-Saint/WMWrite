import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, Events } from 'ionic-angular';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { ISections } from '../../models/Interface';

@Component({
  selector: 'page-table-of-contents',
  templateUrl: 'table-of-contents.html',
})
export class TableOfContentsPage {
  bookid: any;
  nobksection: any;
  error: any;
  bksections: ISections[];
  nosection: any;
  params: Object;
  pushPage: any;
  constructor(public events: Events, public datalink: DatalinkProvider, public loadingCtrl: LoadingController,
    public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.bookid = this.navParams.get("bookid");
    this.getBookTOC();
  }

  ionViewDidLoad() {
  }

  onClose() {
    this.viewCtrl.dismiss();
  }


  getBookTOC() {
    let loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loading.present();
    this.GetOnlineBookTOC(this.bookid, loading);
  }

  GetOnlineBookTOC(id, loading) {
    this.datalink.GetBookSections(id).subscribe(booksections => {
      if (booksections[0] !== "200") {
        this.error = booksections[1];
        this.nosection = "nosection";
        loading.dismiss().catch(() => { });
      } else {
        this.bksections = booksections[1];
        loading.dismiss().catch(() => { });
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Error connecting to server");
    });
  }
  ReadSection(sectionid) {
    let scrollvalue = sectionid;
    let bookid = this.bookid;
    this.events.publish('section:toc', scrollvalue, bookid);
    this.navCtrl.pop();
  }
}
