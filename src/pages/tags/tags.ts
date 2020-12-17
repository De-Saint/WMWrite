import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, AlertController, ActionSheetController, LoadingController } from 'ionic-angular';
import { ITags } from '../../models/Interface';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { TagDetailsPage } from '../tag-details/tag-details';



@Component({
  selector: 'page-tags',
  templateUrl: 'tags.html',
})
export class TagsPage {
  enableHeader: any = false;
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
  groupedTags = [];
  text: any;
  searchTerm: string = '';
  searching: any = false;
  loadingProgress: any;
  parentid: any;
  rootNavCtrl: NavController;
    taginput: { tagname?: string } = {};
  constructor(
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public datalink: DatalinkProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.rootNavCtrl = this.navParams.get('rootNavCtrl');
    this.GetTags();
    this.parentid = this.navParams.get("parentid");

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
        //  this.groupTags(this.tags);
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
    this.GetTags();
  }
  onCancel(ev) {
    this.searchTerm = "";
    this.GetTags();
  }
  LoadMoreTags(infiniteScroll) {
    // if (this.network.type === "none") {
    //   this.datalink.showToast('bottom', "Please reconnect");
    // } else {

    if (this.loadingProgress != 1) {
      this.loadingProgress = 1;
      setTimeout(() => {
        let tc = parseInt(this.tagcount);
        this.firstCount += tc;
        this.datalink.getTags(this.firstCount.toString()).subscribe(newtags => {
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
  }

  getlessTags() {
    this.content.scrollToTop(1000);
  }
  OpenTag(tagid, tagdetails) {
    this.rootNavCtrl.push(TagDetailsPage, { tagid, tagdetails });
  }
  
  
  onSave() {
    var tagname = this.taginput.tagname;
    if (tagname == '') {
      this.datalink.showToast('buttom', "Supply a Tag Name");
      return false;
    } else {
      let loading = this.loadingCtrl.create({
      });
      loading.present();
      // if (this.network.type === "none") {
      //   var newtagid = this.dataservice.generateId();
      //   this.dataservice.setTags(newtagid, tagname, 1);
      //   this.datalink.showToast('buttom', 'Successful');
      //   this.GetTags();
      // } else {
      this.datalink.AddTag(tagname).subscribe(msg => {
        if (msg === "success") {
          this.datalink.showToast('buttom', 'Successful');
          this.GetTags();
          loading.dismiss().catch(() => { });
        } else {
          this.datalink.showToast('buttom', 'Error, something went wrong');
          this.GetTags();
          loading.dismiss().catch(() => { });
        }
        this.taginput.tagname = "";
      }, (err) => {
        loading.dismiss().catch(() => { });
        this.datalink.showToast('bottom', "Error connecting to server");
        return false;
      });
    }
    //}
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
          text: 'Delete Tag',
          handler: () => {
            this.deleteTag(tagid, tagname);
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


  deleteTag(id, name) {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true
    });
    let confirm = this.alertCtrl.create({
      title: 'Tags',
      message: 'Do you want to delete ' + name + ' tag?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.navCtrl.setRoot(TagsPage);
          }
        },
        {
          text: 'Yes',
          handler: () => {
            loading.present();
            // if (this.network.type === "none") {
            //   this.dataservice.DeleteTag(id);
            //   this.datalink.showToast('buttom', 'Successful');
            //   loading.present();
            //   this.GetTags();
            //   loading.dismiss().catch(() => { });
            // } else {
            this.datalink.DeleteTag(id).subscribe(msg => {
              if (msg === "successful") {
                this.datalink.showToast('buttom', 'Successful');
                this.GetTags();
                loading.dismiss().catch(() => { });
              } else {
                this.datalink.showToast('buttom', 'Error, something went wrong');
                this.GetTags();
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
  }



}
