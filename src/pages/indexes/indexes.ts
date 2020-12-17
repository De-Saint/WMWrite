import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, LoadingController, ActionSheetController } from 'ionic-angular';
import { IIndexes } from '../../models/Interface';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { NewIndexPage } from '../new-index/new-index';
import { ObjectTagsPage } from '../object-tags/object-tags';
import { BookMarksPage } from '../book-marks/book-marks';
import { CommentsPage } from '../comments/comments';
import { ObjectBooksPage } from '../object-books/object-books';
import { ObjectSectionsPage } from '../object-sections/object-sections';


@Component({
  selector: 'page-indexes',
  templateUrl: 'indexes.html',
})
export class IndexesPage {
  @ViewChild(Content) content: Content;
  indexes: IIndexes[];
  code: any;
  noindexes: any;
  error: any;
  allindexes: IIndexes[];
  indexcount: any;
  indcount: any;
  originalindexes: any;
  firstcount = 0;
  indexbody: string;
  toggled: boolean;
  searchTerm: string = '';
  searching: any = false;
  loadingProgress: any;
  parentid: any;
  rootNavCtrl: NavController;
  constructor(public actionSheetCtrl: ActionSheetController,
    // public network:Network,
    public loadingCtrl: LoadingController,
    public datalink: DatalinkProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.GetIndexes();
    this.rootNavCtrl = this.navParams.get('rootNavCtrl');
    this.parentid = this.navParams.get("parentid");
  }

  ionViewDidLoad() {

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
  //       this.datalink.showToast('bottom', "Error");
  //     }
  //   });
  // }
  GetRemoteIndexes() {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    let firstCount = "0";
    var search: "";
    this.datalink.GetIndexes(firstCount, search).subscribe(indexes => {
      this.code = indexes[0];
      console.log(indexes);
      loading.dismiss().catch(() => { });
      if (this.code != 200) {
        this.error = indexes[1];
        this.noindexes = "noindexes";
      } else {
        this.indexes = indexes[1];
        this.indexcount = this.indexes[1].count;
        this.originalindexes = indexes[1];
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
      let firstcount = "0";
      var search = "";
      this.loadingProgress = 1;
      this.datalink.GetIndexes(firstcount, search).subscribe(indexes => {
        this.code = indexes[0];
        if (this.code != 200) {
          this.error = indexes[1];
          this.noindexes = "noindexes";
          refresher.complete();
        } else {
          this.indexes = indexes[1];
          this.indexcount = this.indexes[1].count;
          this.originalindexes = indexes[1];
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
    //           this.indexes = [];
    //           this.originalindexes = [];
    //         }
    //         return false;
    //       }
    //     });
    //   }
    // } else {
    var search = this.searchTerm;
    if (search.trim().length >= 3) {
      let firstCount = "0";
      this.datalink.GetIndexes(firstCount, search).subscribe(indexes => {
        this.code = indexes[0];
        if (this.code != 200) {
          this.error = indexes[1];
          this.indexes = [];
          this.originalindexes = [];
          this.noindexes = "noindexes";
        } else {
          this.indexes = indexes[1];
          this.indexcount = this.indexes[0].count;
          this.originalindexes = indexes[1];
        }
      }, (err) => {
        this.datalink.showToast('bottom', "Error connecting to server");
        return false;
      });
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
    //   this.datalink.showToast('bottom', "Please reconnect");
    // } else {

    if (this.loadingProgress != 1) {
      this.loadingProgress = 1;
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
              this.indexes = this.originalindexes;
              this.noindexes = 'none';
              infiniteScroll.complete();
              infiniteScroll.enable(false);
            } else {
              this.indexes = [];
              this.indexes = this.originalindexes.concat(newindexes[1]);
              this.originalindexes = this.indexes;
              infiniteScroll.complete();
            }
            this.loadingProgress = 0;
          }, (err) => {
            infiniteScroll.complete();
            this.datalink.showToast('bottom', "Error connecting to server");
            this.loadingProgress = 0;
            return false;
          });
        }
        infiniteScroll.complete();
      }, 2000);
    }
  }


  getlessIndexes() {
    this.content.scrollToTop();
  }


  OpenIndexAction(index) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Index Options',
      buttons: [
        {
          text: 'View/Edit Index',
          handler: () => {
            this.rootNavCtrl.push(NewIndexPage, {
              index,
              indextype: "editIndex"
            })
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
  onOpenBooks(indexid) {
    this.navCtrl.push(ObjectBooksPage, { parentid: indexid, parenttype: "index" });
  }
  onOpenTags(indexid) {
    this.navCtrl.push(ObjectTagsPage, { parentid: indexid, parenttype: "index" });
  }
  onOpenBookMarks(indexid) {
    this.navCtrl.push(BookMarksPage, { parentid: indexid, parenttype: "index" });
  }
  onOpenComments(indexid) {
    this.navCtrl.push(CommentsPage, { parentid: indexid, parenttype: "index" });
  }
  onOpenSections(indexid) {
    this.navCtrl.push(ObjectSectionsPage, { parentid: indexid, parenttype: "index" });
  }

}
