import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, Content, AlertController, ActionSheetController } from 'ionic-angular';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { ITags } from '../../models/Interface';
import { TagDetailsPage } from '../tag-details/tag-details';
import { TagsPage } from '../tags/tags';


@Component({
  selector: 'page-object-tags',
  templateUrl: 'object-tags.html',
})
export class ObjectTagsPage {
  @ViewChild(Content) content: Content;
  tags: ITags[];
  code: any;
  notags: any;
  error: any;
  alltags: ITags[];
  tagcount: string;
  tgcount: string;
  originaltags: any;
  firstCount = 0;
  count: string;
  parenttype: any;
  parentid: any;
  searchTerm: string = '';
  constructor(public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public datalink: DatalinkProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.parentid = this.navParams.get("parentid");
    this.parenttype = this.navParams.get("parenttype");
    this.ObjectTags(this.parentid, this.parenttype);
  }

  ionViewDidLoad() {

  }

  ObjectTags(parentid, parenttype) {
    // if (this.network.type === "none") {
    //   this.getOfflineBookTags(this.bookid);
    // } else {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.getObjectTags(parentid, String(this.firstCount), parenttype).subscribe(tags => {
      if (tags[0] !== "200") {
        this.error = tags[1];
        this.notags = "nobktags";
        loading.dismiss().catch(() => { });
      } else {
        this.tags = tags[1];
        this.tagcount = this.tags[0].count;
        this.originaltags = tags[1];
        console.log(this.tags);
        loading.dismiss().catch(() => { });
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Error connecting to server");
      // this.getOfflineBookTags(this.bookid);
    });
    //}
  }

  //--------------------------------------------Delete Tag---------------------------------------------

  //--------------------------------------------Get More Book Tags ---------------------------------------------
  LoadMoreTags(infiniteScroll) {
    // if (this.network.type === "none") {
    // } else {
    setTimeout(() => {
      if (this.tagcount === null || this.tagcount === undefined) {
        infiniteScroll.complete();
        infiniteScroll.enable(false);
        return false;
      } else {
        let tc = parseInt(this.tagcount);
        this.firstCount += tc;
        this.datalink.getObjectTags(this.parentid, String(this.firstCount), this.parenttype).subscribe(newbktags => {
          if (newbktags[0] !== "200") {
            this.error = newbktags[1];
            this.notags = 'none';
            infiniteScroll.complete();
            infiniteScroll.enable(false);
          } else {
            this.tags = [];
            this.tags = this.originaltags.concat(newbktags[1]);
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

  getlessTags() {
    this.content.scrollToTop(1000);
  }
  onNewTag(){
    this.navCtrl.push(TagsPage);

  }
  openTagOption(tagid, tagname, tag) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Tag Options',
      buttons: [
        {
          text: 'View/Edit Tag',
          handler: () => {
            this.OpenTag(tagid, tag);
          }
        },
        {
          text: 'Remove Tag',
          handler: () => {
            this.UnlinkTag(tagid, tagname);
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
    this.navCtrl.push(TagDetailsPage, { tagid, tagdetails });
  }
  UnlinkTag(id, name) {
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Tags',
      message: 'Do you want to remove ' + name + ' tag from ' + this.parenttype + '?',
      buttons: [
        {
          text: 'No',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          handler: () => {
            loading.present();
            // if (this.network.type === "none") {
            //   this.dataservice.UnlinkTag(id);
            //   this.datalink.showToast('buttom', 'Tag deleted');
            //   this.getBookTags();
            //   document.getElementById("normaltaglist").removeAttribute("class");
            //   document.getElementById("searchtaglist").setAttribute("class", "hide");
            //   document.getElementById("searchbar").setAttribute("class", "hide");
            //   loading.dismiss().catch(() => { });
            // } else {
            this.datalink.UnlinkTag(id, this.parenttype).subscribe(msg => {
              if (msg === "successful") {
                this.datalink.showToast('buttom', 'Successful');
                this.ObjectTags(this.parentid, this.parenttype);
                loading.dismiss().catch(() => { });
              } else {
                this.datalink.showToast('buttom', 'Error something went wrong');
                this.ObjectTags(this.parentid, this.parenttype);
                loading.dismiss().catch(() => { });
              }
            }, (err) => {
              loading.dismiss().catch(() => { });
              this.datalink.showToast('bottom', "Error connecting to server");
              return false;
            });
          }
        }
        //}
      ]
    });
    confirm.present();

    // }

  }
  // getOfflineBookTags(bookid) {
  //   this.dataservice.getOfflineBookTags(bookid).then((result) => {
  //     if (result.res.rows.length > 0) {
  //       for (var i = 0; i < result.res.rows.length; i++) {
  //         let item2id = result.res.rows.item(i).ItemTwoId;
  //         this.getTagDetails(item2id);
  //       }
  //     } else {
  //       this.nobktags = "nobktags";
  //       this.datalink.showToast('bottom', "No Offline Tags for this Book");
  //     }
  //   });
  // }

  // getTagDetails(tagid) {
  //   this.bktags = []
  //   this.originalbktags = [];
  //   this.dataservice.getOfflineTagDetails(tagid).then((result) => {
  //     if (result.res.rows.length > 0) {
  //       for (var i = 0; i < result.res.rows.length; i++) {
  //         let item = result.res.rows.item(i);
  //         this.bktags.push(item);
  //         this.originalbktags.push(item);
  //       }
  //     } else {
  //       this.nobktags = "nobktags";
  //     }
  //   });
  // }


  SearchTags() {
    // if (this.network.type === "none") {
    //   var val = this.searchTerm;
    //   if (val && val.trim() != '') {
    //     this.tags = this.originaltags.filter((v) => {
    //       if (v.name.toLocaleLowerCase().indexOf(val.toLowerCase()) > -1) {
    //         this.notags = "full";
    //         return true;
    //       } else {
    //         if (this.tags.length === 0) {
    //           this.notags = "notags";
    //           this.tags = [];
    //           this.originaltags = [];
    //         }
    //         return false;
    //       }
    //     });
    //   }
    // } else {
    var search = this.searchTerm;
    if (search.trim().length >= 3) {
      let firstCount = "0";
      this.datalink.GetTags(firstCount, search).subscribe(tags => {
        this.code = tags[0];
        if (this.code != 200) {
          this.error = tags[1];
          this.notags = "notags";
          this.tags = [];
          this.originaltags = [];
        } else {
          this.tags = tags[1];
          this.tagcount = this.tags[0].count;
          this.originaltags = tags[1];
        }
      }, (err) => {
        this.datalink.showToast('bottom', "Error connecting to server");
        return false;
      });
    }
    //}
  }
  onClear(ev) {
    this.searchTerm = "";
   
  }
  onCancel(ev) {
    this.searchTerm = "";
   
  }
}
