import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ActionSheetController } from 'ionic-angular';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { ITags } from '../../models/Interface';
import { TagDetailsPage } from '../tag-details/tag-details';

@Component({
  selector: 'page-add-tag',
  templateUrl: 'add-tag.html',
})
export class AddTagPage {
  parentid: any;
  parenttype: any;
  searchTerm: string = '';
  firstCount = 0;
  tags: ITags[];
  code: any;
  notags: any;
  error: any;
  alltags: ITags[];
  tagcount: string;
  tgcount: string;
  originaltags: any;
  count: string;
  loadingProgress: any;
  
  constructor(public loadingCtrl: LoadingController,
    public datalink: DatalinkProvider,
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController, public navParams: NavParams) {
    this.parentid = this.navParams.get("parentid");
    this.parenttype = this.navParams.get("parenttype");
    this.GetTags();
  }

  ionViewDidLoad() {
  }
  GetTags() {
    // if (this.network.type === "none") {
    //   this.GetLocalTags();
    // } else {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.GetRemoteTags(loading);
    // }
  }
  // GetLocalTags() {
  //   this.tags = [];
  //   this.originaltags = [];
  //   this.dataservice.getOfflineTags().then((result) => {
  //     if (result.res.rows.length > 0) {
  //       for (var i = 0; i < result.res.rows.length; i++) {
  //         let item = result.res.rows.item(i);
  //         this.tags.push(item);
  //         this.originaltags.push(item);
  //       }
  //     } else {
  //       this.datalink.showToast('bottom', "Error");
  //     }
  //   });
  // }
  GetRemoteTags(loading) {
    let firstcount = this.firstCount.toString();
    var search = "";
    this.datalink.GetTags(firstcount, search).subscribe(tags => {
      this.code = tags[0];
      if (this.code != 200) {
        this.error = tags[1];
        this.notags = "notags";
        loading.dismiss().catch(() => { });
      } else {
        this.tags = tags[1];
        this.tagcount = this.tags[0].count;
        this.originaltags = tags[1];
        loading.dismiss().catch(() => { });
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Error connecting to server");
      return false;
    });
  }
  doRefresh(refresher) {
    // if (this.network.type === "none") {
    //   this.datalink.showToast('bottom', "Please reconnect");
    // } else {

    if (this.loadingProgress != 1) {
      let firstCount = "0";
      var search = "";
      this.loadingProgress = 1;
      this.datalink.GetTags(firstCount, search).subscribe(tags => {
        this.code = tags[0];
        if (this.code != 200) {
          this.error = tags[1];
          this.notags = "notags";;
          refresher.complete();
        } else {
          this.tags = tags[1];
          this.tagcount = this.tags[1].count;
          this.originaltags = tags[1];
          refresher.complete();
        }
        this.loadingProgress = 0;
      }, (err) => {
        refresher.complete();
        this.datalink.showToast('bottom', "Error connecting to server");
        this.loadingProgress = 0;
        return false;
      });
    }
  }
  onSave(tagid) {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    // if (this.network.type === "none") {
    //   var joinid = this.dataservice.generateId;
    //   this.dataservice.setArticlesjoin(joinid, 1, "Book", "Tag", bookid, tagid, 1);
    //   this.datalink.showToast('buttom', 'Tag added');
    //   document.getElementById("normaltaglist").removeAttribute("class");
    //   document.getElementById("searchtaglist").setAttribute("class", "hide");
    //   document.getElementById("searchbar").setAttribute("class", "hide");
    //   this.getBookTags();
    // } else {
    this.datalink.AddTagToObject(tagid, this.parentid, this.parenttype).subscribe(msg => {
      if (msg === "success") {
        this.datalink.showToast('buttom', 'Tag added');
        loading.dismiss().catch(() => { });
      } else {
        this.datalink.showToast('buttom', 'Error something went wrong');
        loading.dismiss().catch(() => { });
      }
      this.navCtrl.pop();
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Error connecting to server");
      return false;
    });
    // }

  }

  SearchTags() {
    // if (this.network.type === "none") {
    //   var val = this.searchTerm;
    //   if (val && val.trim() != '') {
    //     this.booktags = this.originalbooktags.filter((v) => {
    //       if (v.header.toLocaleLowerCase().indexOf(val.toLowerCase()) > -1 || v.subheader.toLocaleLowerCase().indexOf(val.toLowerCase()) > -1) {
    //         this.nobktags = "full";
    //         return true;
    //       } else {
    //         if (this.booktags.length === 0) {
    //           this.nobktags = "nobktags";
    //           this.booktags = [];
    //           this.originalbooktags = [];
    //         }
    //         return false;
    //       }
    //     });
    //   }
    // } else {
    let term = this.searchTerm;
    let firstCount = 0;
    this.datalink.GetTags(String(firstCount), term).subscribe(tags => {
      if (tags[0] !== "200") {
        this.error = tags[1];
        this.tags = [];
        this.originaltags = [];
        this.notags = "nobktags";
      } else {
        this.tags = tags[1];
        this.originaltags = tags[1];
        this.notags = "full";
      }
    });
    //}
  }
  LoadMoreTags(infiniteScroll) {
    // if (this.network.type === "none") {
    // } else {
      if (this.loadingProgress != 1) {
        this.loadingProgress = 1;
        setTimeout(() => {
          let tc = parseInt(this.tagcount);
          this.firstCount += tc;
          this.datalink.getTags(String(this.firstCount)).subscribe(newtags => {
            this.code = newtags[0];
            if (this.code === "400") {
              this.error = newtags[1];
              this.tags = this.originaltags;
              this.notags = 'none';
              infiniteScroll.complete();
              infiniteScroll.enable(false);
            } else {
              this.tags = [];
              this.tags = this.originaltags.concat(newtags[1]);
              this.originaltags = this.tags;
              infiniteScroll.complete();
            }
            this.loadingProgress = 0;
          }, (err) => {
            infiniteScroll.complete();
            this.datalink.showToast('bottom', "Error connecting to server");
            this.loadingProgress = 0;
            return false;
          });
  
          infiniteScroll.complete();
        }, 2000);
      }
    // }
  }

  openTagOption(tagid, tag) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Tag Options',
      buttons: [
        {
          text: 'Add Tag',
          handler: () => {
            this.onSave(tagid);
          }
        },
        {
          text: 'Open Tag',
          handler: () => {
            this.OpenTag(tagid, tag);
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

  OpenTag(tagid, tagdetails) {
    this.navCtrl.push(TagDetailsPage, { tagid , tagdetails});
  }
}
