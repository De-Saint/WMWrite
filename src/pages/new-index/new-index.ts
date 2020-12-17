import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { DatalinkProvider } from '../../providers/datalink/datalink';



@Component({
  selector: 'page-new-index',
  templateUrl: 'new-index.html',
})
export class NewIndexPage {
  indexid: any;
  indextype: any;
  loadedindex: any;

  index: {
    header?: string,
    subheader?: string,
    body?: string
  } = {};
  constructor(public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    public datalink: DatalinkProvider, public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams) {
    this.indextype = this.navParams.get("indextype");
    this.loadedindex = this.navParams.get("index");
     
    console.log(this.indextype);
    console.log(this.loadedindex);
  }

  ionViewDidLoad() {
     if (this.loadedindex !== undefined) {
      this.index.header = this.loadedindex.header;
      this.index.subheader = this.loadedindex.subheader;
      this.index.body = this.loadedindex.body_text;
      this.indexid = this.loadedindex.id;
    }
  }
  onSave() {
    var header = this.index.header;
    if (header === "" || header === undefined || header === null) {
      this.datalink.showToast('bottom', "Error! please supply the Header");
      return false
    }

    var subheader = this.index.subheader;
    if (subheader === "" || subheader === undefined || subheader === null) {
      this.datalink.showToast('bottom', "Error! please supply the Sub-Header");
      return false
    }
    var body = this.index.body;
    if (body === "" || body === undefined || body === null) {
      this.datalink.showToast('bottom', "Error! please supply the Body/Content");
      return false
    }
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    // if (this.network.type === "none") {
    //   loading.dismiss().catch(() => { });
    //   var indexid = this.dataservice.generateId();
    //   this.dataservice.setIndexes(indexid, header, subheader, body);
    //   this.datalink.showToast('bottom', "Successful");
    // } else {
    this.datalink.AddIndex(header, subheader, body).subscribe(msg => {
      if (msg === "failed") {
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
    // }

  }
  onUpdate() {
    var header = this.index.header;
    if (header === "" || header === undefined || header === null) {
      this.datalink.showToast('bottom', "Error! please supply the Header");
      return false
    }

    var subheader = this.index.subheader;
    if (subheader === "" || subheader === undefined || subheader === null) {
      this.datalink.showToast('bottom', "Error! please supply the Sub-Header");
      return false
    }
    var body = this.index.body;
    if (body === "" || body === undefined || body === null) {
      this.datalink.showToast('bottom', "Error! please supply the Body/Content");
      return false
    }
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    // if (this.network.type === "none") {
    //   loading.dismiss().catch(() => { });
    //   this.dataservice.setIndexes(this.indexid, header, subheader, body);
    //   this.datalink.showToast('bottom', "Successful");
    // } else {
    this.datalink.UpdateIndex(this.indexid, header, subheader, body).subscribe(msg => {
      if (msg === "failed") {
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
    // }
  }
}
