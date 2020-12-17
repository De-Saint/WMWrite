import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, ActionSheetController, LoadingController } from 'ionic-angular';
import { IBooks } from '../../models/Interface';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { BookDetailsPage } from '../book-details/book-details';
import { Storage } from '@ionic/storage';
import { SuperTabsController } from 'ionic2-super-tabs';
import { ObjectTagsPage } from '../object-tags/object-tags';
import { ObjectIndexesPage } from '../object-indexes/object-indexes';
import { CommentsPage } from '../comments/comments';
import { SectionDisplayPage } from '../section-display/section-display';

@Component({
  selector: 'page-articles',
  templateUrl: 'articles.html',
})
export class ArticlesPage {
  @ViewChild(Content) content: Content;
  articles: IBooks[];
  code: any;
  nobooks: any;
  error: any;
  articlecount: any;
  artcount: any;
  originalarticles: any;
  firstcount = 0;
  userid: any;
  loadProgress: string;
  articleid: any;
  toggled: boolean;
  rootNavCtrl: NavController;
  searchTerm: string = '';
  searching: any = false;
  constructor(
    public storage: Storage, public datalink: DatalinkProvider,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController, public navParams: NavParams) {
    this.GetArticles("A-Z");
    this.rootNavCtrl = this.navParams.get('rootNavCtrl');
  }

  ionViewDidLoad() {
  }
  GetArticles(filter) {
    this.GetRemoteArticles(filter);
  }

  OpenBook(bookid){
    this.rootNavCtrl.push(BookDetailsPage, { bookid });
  }
  onOpenTags(bookid) {
    this.rootNavCtrl.push(ObjectTagsPage, { parentid: bookid, parenttype: "Book" });
  }
  onOpenIndex(bookid) {
    this.rootNavCtrl.push(ObjectIndexesPage, { parentid: bookid, parenttype: "Book" });
  }
  onOpenComments(bookid) {
    this.rootNavCtrl.push(CommentsPage, { parentid: bookid, parenttype: "Book" });
  }
  onOpenSections(bookid) {
    this.rootNavCtrl.push(SectionDisplayPage, { bookid: bookid });
  }

  GetRemoteArticles(filter) {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    let firstCount = "0";
    var search = "";
    this.datalink.GetArticles(firstCount, search, filter).subscribe(articles => {
      if (articles[0] === "400") {
        this.error = articles[1];
        this.nobooks = "nobooks";
        loading.dismiss().catch(() => { });
      } else {
        this.articles = articles[1];
        this.articlecount = this.articles[0].count;
        this.originalarticles = articles[1];
        loading.dismiss().catch(() => { });
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Error connecting to the server, please try again.");
      return false;
    });
  }
  
  doRefresh(refresher) {
    let firstCount = "0";
    var search = "";
    this.datalink.GetArticles(firstCount, search, "A-Z").subscribe(articles => {
      this.code = articles[0];
      if (this.code != "200") {
        this.error = articles[1];
        this.nobooks = "nobooks";
        refresher.complete();
      } else {
        this.articles = articles[1];
        this.articlecount = this.articles[1].count;
        this.originalarticles = articles[1];
        refresher.complete();
      }
    }, (err) => {
      refresher.complete();
      this.datalink.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }
  onClear(ev) {
    this.searchTerm = "";
    this.GetArticles("A-Z");
  }
  onCancel(ev) {
    this.searchTerm = "";
    this.GetArticles("A-Z");
  }
  SearchArticles() {
    var search = this.searchTerm;
    if (search.trim().length >= 3) {
      let firstCount = "0";
      this.datalink.GetArticles(firstCount, search, "A-Z")
        .subscribe(articles => {
          this.code = articles[0];
          if (this.code != "200") {
            this.articles = [];
            this.error = articles[1];
            this.nobooks = "nobooks";
          } else {
            this.articles = articles[1];
            this.articlecount = this.articles[0].count;
            this.originalarticles = articles[1];
          }
        }, (err) => {
          this.datalink.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
          return false;
        });
    }
    //}
  }

  LoadMoreBooks(infiniteScroll: any) {
    setTimeout(() => {
      if (this.articlecount === null || this.articlecount === undefined) {
        infiniteScroll.complete();
        infiniteScroll.enable(false);
        return false;
      } else {
        let tc = parseInt(this.articlecount);
        this.firstcount += tc;
        this.datalink.getArticles(this.firstcount.toString(), "A-Z").subscribe(newarticles => {
          this.code = newarticles[0];
          if (this.code === "400") {
            this.error = newarticles[1];
            this.articles = [];
            this.originalarticles = [];
            infiniteScroll.complete();
            infiniteScroll.enable(false);
          } else {
            this.articles = [];
            this.articles = this.originalarticles.concat(newarticles[1]);
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
    //}
  }

  getlessBooks() {
    this.content.scrollToTop();
  }


  FilterBooks() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Sort Articles by',
      buttons: [
        {
          text: 'A-Z',
          handler: () => {
            this.GetArticles("A-Z");
          }
        },
        {
          text: 'Z-A',
          handler: () => {
            this.GetArticles("Z-A");
          }
        },
        {
          text: 'Date Created',
          handler: () => {
            this.GetArticles("Created");
          }
        },
        {
          text: 'Date Modified',
          handler: () => {
            this.GetArticles("Modified");
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
}
