import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, ActionSheetController, Content } from 'ionic-angular';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { IIndexes } from '../../models/Interface';

@Component({
  selector: 'page-add-index',
  templateUrl: 'add-index.html',
})
export class AddIndexPage {
  @ViewChild(Content) content: Content;
  parentid: any;
  parenttype: any;
  indexes: IIndexes[];
  code: any;
  noindexes: any;
  error: any;
  allindexes: IIndexes[];
  indexcount: any;
  indcount: any;
  originalindexes: any;
  firstcount: number = 0;
  indexbody: string;
  searchTerm: string = '';
  index: {
    body?: string
  } = {};
  constructor(
    public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController, public datalink: DatalinkProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.parentid = this.navParams.get("parentid");
    this.parenttype = this.navParams.get("parenttype");
    this.GetIndexes();
  }

  ionViewDidLoad() {
    console.log(this.parentid);
    console.log(this.parenttype);
  }
  GetIndexes() {
    // if (this.network.type === "none") {
    //   this.GetLocalIndexes();
    // } else {
    this.GetRemoteIndexes();
    // }
  }
  // GetLocalIndexes() {
  //   this.indexes = [];
  //   this.originalindexes = [];
  //   this.dataservice.getOfflineIndexes().then((result) => {
  //     if (result.res.rows.length > 0) {
  //       for (var i = 0; i < result.res.rows.length; i++) {
  //         let item = result.res.rows.item(i);
  //         this.indexes.push(item);
  //         this.originalindexes.push(item);
  //       }
  //     } else {
  //       this.datalink.showToast('bottom', "Error please reconnect and download indexes from online server");
  //     }
  //   });
  // }
  GetRemoteIndexes() {
    let firstCount = "0";
    var search: "";
    this.datalink.GetIndexes(firstCount, search).subscribe(indexes => {
      this.code = indexes[0];
      if (this.code != 200) {
        this.error = indexes[1];
        this.noindexes = "noindexes";
      } else {
        this.indexes = indexes[1];
        this.indexcount = this.indexes.length;
        this.originalindexes = indexes[1];
      }
    }, (err) => {
      this.datalink.showToast('bottom', "Error connecting to server");
      return false;
    });
  }

  SearchIndexes() {
    // if (this.network.type === "none") {
    //   var val = this.searchTerm;
    //   if (val && val.trim() != '') {
    //     this.indexes = this.originalindexes.filter((v) => {
    //       if (v.header.toLocaleLowerCase().indexOf(val.toLowerCase()) > -1 || v.subheader.toLocaleLowerCase().indexOf(val.toLowerCase()) > -1) {
    //         this.noindexes = "full";
    //         return true;
    //       } else {
    //         if (this.indexes.length === 0) {
    //           this.noindexes = "noindexes";
    //         }
    //         return false;
    //       }
    //     });
    //   }
    // } else {
    let term = this.searchTerm;
    if (term.trim() === '' || term.trim().length < 2) {
      this.indexes = this.originalindexes;
    } else {
      if (term.trim().length > 3) {
        let firstCount = this.firstcount.toString();
        this.datalink.GetIndexes(firstCount, term).subscribe(indexes => {
          this.code = indexes[0];
          if (this.code != 200) {
            this.error = indexes[1];
            this.indexes = [];
            this.originalindexes = [];
            this.noindexes = "noindexes";
          } else {
            this.indexes = indexes[1];
            this.originalindexes = indexes[1];
            this.noindexes = "full";
          }
        });
      }
    }
    // }

  }
  onClear(ev) {
    this.searchTerm = "";
    this.GetRemoteIndexes();
  }
  onCancel(ev) {
    this.searchTerm = "";
    this.GetRemoteIndexes();
  }
  LoadMoreIndexes(infiniteScroll) {
    // if (this.network.type === "none") {
    //   this.datalink.showToast('bottom', "Reconnect");
    // } else {
    setTimeout(() => {
      if (this.indexcount === null || this.indexcount === undefined) {
        infiniteScroll.complete();
        infiniteScroll.enable(false);
        return false;
      } else {
        let tc = parseInt(this.indexcount);
        this.firstcount += tc;
        this.datalink.getIndexes(this.firstcount.toString()).subscribe(newindexes => {
          this.code = newindexes[0];
          if (this.code != 200) {
            this.error = newindexes[1];
            this.noindexes = 'none';
            infiniteScroll.complete();
            infiniteScroll.enable(false);
          } else {
            this.indexes = [];
            this.indexes = this.originalindexes.concat(newindexes[1]);
            infiniteScroll.complete();
          }
        }, (err) => {
          infiniteScroll.complete();
          this.datalink.showToast('bottom', "Error connecting to server");
          return false;
        });
      }
      infiniteScroll.complete();
    }, 2000);
    // }
  }
  getlessIndexes() {
    this.content.scrollToTop();
  }

  placeheader(header) {
    var div = document.getElementById("header");
    var headertext = div.innerHTML;
    if (headertext.includes(header)) {
      header = header + ":";
      div.innerHTML = div.innerHTML.replace(header, '');
    } else {
      div.innerHTML = div.innerHTML + header + ":";
    }

  }

  onSave() {
    var div = document.getElementById("header").innerHTML;
    var headertxt = div.split(":");
    var mainheader = headertxt[0];
    var subheader = div.replace(mainheader + ':', '');
    subheader = subheader.substring(0, subheader.length - 1);
    var body = this.index.body;
    if (body == '') {
      return false;
    } else {
      let loading = this.loadingCtrl.create({
        content: "Please wait...",
      });
      loading.present();
      this.datalink.AddIndexTo(mainheader.trim(), subheader.trim(), body.trim(), this.parenttype, this.parentid).subscribe(msg => {
        if (msg === "failed") {
          loading.dismiss().catch(() => { });
          this.datalink.showToast('bottom', "Error, something went wrong!");
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
