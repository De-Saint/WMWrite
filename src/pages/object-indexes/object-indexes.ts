import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, Content, ActionSheetController } from 'ionic-angular';
import { IIndexes } from '../../models/Interface';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { NewIndexPage } from '../new-index/new-index';
import { ObjectTagsPage } from '../object-tags/object-tags';
import { BookMarksPage } from '../book-marks/book-marks';
import { CommentsPage } from '../comments/comments';
import { ObjectSectionsPage } from '../object-sections/object-sections';
import { ObjectBooksPage } from '../object-books/object-books';

@Component({
  selector: 'page-object-indexes',
  templateUrl: 'object-indexes.html',
})
export class ObjectIndexesPage {
  @ViewChild(Content) content: Content;
  parentid: any;
  parenttype: any;
  indexes: IIndexes[];
  allindexes: IIndexes[];
  noindexes: any;
  firstCount = 0;
  indexcount = 0;
  indcount: any;
  error: any;
  originalindexes: any;
  loadingProgress: any;
  code: any;
  constructor(public datalink: DatalinkProvider,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController, public navParams: NavParams) {

    this.parentid = this.navParams.get("parentid");
    this.parenttype = this.navParams.get("parenttype");
    this.getObjectIndexes(this.parentid, this.parenttype);
  }

  ionViewDidLoad() {

  }

  getObjectIndexes(parentid, parenttype) {
    // if (this.network.type === "none") {
    //   this.getOfflineBookIndexIDs(this.bookid);
    // } else {
    let loading = this.loadingCtrl.create({
      content: "Loading...",
    });
    loading.present();
    this.datalink.GetObjectIndexes(parentid, String(this.firstCount), parenttype).subscribe(indexes => {
      if (indexes[0] === "400") {
        this.error = indexes[1];
        this.noindexes = "noindexes";
        loading.dismiss().catch(() => { });
      } else {
        this.indexes = indexes[1];
        this.indexcount = this.indexes[0].count;
        this.originalindexes = indexes[1];
        loading.dismiss().catch(() => { });
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Error connecting to server");
      // this.getOfflineBookIndexIDs(this.bookid);
    });
    //}
  }

  getMoreObjectIndexes(infiniteScroll) {
    // if (this.network.type === "none") {
    // } else {
    setTimeout(() => {
      if (this.indexcount === null || this.indexcount === undefined) {
        infiniteScroll.complete();
        infiniteScroll.enable(false);
        return false;
      } else {
        this.firstCount += this.indexcount;
        this.datalink.GetObjectIndexes(this.parentid, String(this.indexcount), this.parenttype).subscribe(newindexes => {
          if (newindexes[0] != "200") {
            this.error = newindexes[1];
            this.noindexes = 'none';
            infiniteScroll.complete();
            infiniteScroll.enable(false);
          } else {
            this.indexes = [];
            this.indexes = this.originalindexes.concat(newindexes[1]);
          }
        }, (err) => {
          infiniteScroll.enable(false);
          infiniteScroll.complete();
          return false;
        });
      }
      infiniteScroll.complete();
    }, 2000);
    // }
  }

  doRefresh(refresher) {
    if (this.loadingProgress != 1) {
      this.loadingProgress = 1;
      this.datalink.GetObjectIndexes(this.parentid, String(this.firstCount), this.parenttype).subscribe(indexes => {
        this.code = indexes[0];
        if (this.code != 200) {
          this.error = indexes[1];
          this.noindexes = "nobkindexes";
          refresher.complete();
        } else {
          this.indexes = indexes[1];
          this.indexcount = this.indexes[0].count;
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

  getlessObjectIndexes() {
    this.content.scrollToTop();
  }

  OpenIndexAction(indexid, index) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Index Options',
      buttons: [
        {
          text: 'View / Edit Index',
          handler: () => {
            this.navCtrl.push(NewIndexPage, {
              index,
              indextype: "editIndex"
            })
          }
        },
        {
          text: 'Remove Index',
          handler: () => {
            this.deleteIndex(indexid);
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

  deleteIndex(indexid) {
    this.datalink.DeleteIndex(indexid, this.parenttype)
      .subscribe(success => {
        if (success == "successful") {
          this.datalink.showToast('bottom', "Successful");
        } else {
          this.datalink.showToast('bottom', "Error something went wrong");
        }
      }, err => {
        this.datalink.showToast('bottom', "Error connecting to server");
      })

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
  onOpenBooks(indexid) {
    this.navCtrl.push(ObjectBooksPage, { parentid: indexid, parenttype: "index" });
  }

}
