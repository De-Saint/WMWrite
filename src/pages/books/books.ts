import { Component, ViewChild } from '@angular/core';
import {  NavController, NavParams, Content, LoadingController } from 'ionic-angular';
import { IBooks } from '../../models/Interface';
import { BookDetailsPage } from '../book-details/book-details';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { SuperTabsController } from 'ionic2-super-tabs';
import { ObjectTagsPage } from '../object-tags/object-tags';
import { ObjectIndexesPage } from '../object-indexes/object-indexes';
import { CommentsPage } from '../comments/comments';
import { SectionDisplayPage } from '../section-display/section-display';

@Component({
  selector: 'page-books',
  templateUrl: 'books.html',
})
export class BooksPage {
  Objects: string;
  rootNavCtrl: NavController;
  @ViewChild(Content) content: Content;
  books: IBooks[];
  code: any;
  nobooks: any;
  error: any;
  allbooks: IBooks[];
  bookcount: any;
  bkcount: any;
  originalbooks: any;
  firstcount = 0;
  userid: any;
  loadProgress: string;
  bookid: any;
  toggled: boolean;
  searchTerm: string = '';
  searching: any = false;
  loadingProgress: any;
  constructor(public navCtrl: NavController,
    public datalink: DatalinkProvider,
    public superTabsCtrl: SuperTabsController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
    this.GetBooks("A-Z");
    this.rootNavCtrl = this.navParams.get('rootNavCtrl');
  }

  ionViewDidLoad() {
   
  }
  OpenBook(bookid) {
    this.rootNavCtrl.push(BookDetailsPage, { bookid });
  }


  GetBooks(filter) {
    this.GetRemoteBooks(filter);
  }
  GetRemoteBooks(filter) {
    let loading = this.loadingCtrl.create({
    });
    // loading.present();
    let firstCount = "0";
    var search = "";
    this.datalink.GetBooks(firstCount, search, filter).subscribe(books => {
      loading.dismiss().catch(() => { });
      if (books[0] === "400") {
        this.error = books[1];
        this.nobooks = "nobooks";
        loading.dismiss().catch(() => { });
      } else {
        this.books = books[1];
        this.bookcount = this.books[0].count;
        this.originalbooks = books[1];
        loading.dismiss().catch(() => { });
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Loading offline Books");
      return false;
    });
  }
  doRefresh(refresher) {
    if (this.loadingProgress != 1) {
      let firstCount = "0";
      var search = "";
      this.loadingProgress = 1;
      this.datalink.GetBooks(firstCount, search, "A-Z").subscribe(books => {
        this.code = books[0];
        if (this.code != 200) {
          this.error = books[1];
          this.nobooks = "nobooks";
          refresher.complete();
        } else {
          this.books = books[1];
          this.bookcount = this.books[1].count;
          this.originalbooks = books[1];
          refresher.complete();
        }
        this.loadingProgress = 0;
      }, (err) => {
        refresher.complete();
        this.datalink.showToast('bottom', "Error connecting to server");

        return false;
      });
    }
  }
  onClear(ev) {
    this.searchTerm = "";
    this.GetBooks("A-Z");
  }
  onCancel(ev) {
    this.searchTerm = "";
    this.GetBooks("A-Z");
  }
  SearchBooks() {
    var search = this.searchTerm;
    if (search.trim().length >= 3) {
      let firstCount = "0";
      this.datalink.GetBooks(firstCount, search, "A-Z")
        .subscribe(books => {
          this.code = books[0];
          if (this.code != "200") {
            this.books = [];
            this.error = books[1];
            this.nobooks = "nobooks";
          } else {
            this.books = books[1];
            this.bookcount = this.books[0].count;
            this.originalbooks = books[1];
          }
        }, (err) => {
          this.datalink.showToast('bottom', "Error connecting to server");
          return false;
        });
    }
    //}
  }

  LoadMoreBooks(infiniteScroll: any) {
    if (this.loadingProgress != 1) {
      this.loadingProgress = 1;
      setTimeout(() => {
        if (this.bookcount === null || this.bookcount === undefined) {
          infiniteScroll.complete();
          infiniteScroll.enable(false);
          return false;
        } else {
          let tc = parseInt(this.bookcount);
          this.firstcount += tc;
          this.datalink.getBooks(this.firstcount.toString(), "A-Z").subscribe(newbooks => {
            this.code = newbooks[0];
            if (this.code === "400") {
              this.error = newbooks[1];
              this.books = this.originalbooks;
              infiniteScroll.complete();
              infiniteScroll.enable(false);
            } else {
              this.books = [];
              this.books = this.originalbooks.concat(newbooks[1]);
              this.originalbooks = this.books;
              infiniteScroll.complete();
            }
            this.loadingProgress = 0;
          }, (err) => {
            infiniteScroll.complete();
            infiniteScroll.enable(false);
            this.loadingProgress = 0;
            return false;
          });
        }
        infiniteScroll.complete();
      }, 2000);
    }
  }

  getlessBooks() {
    this.content.scrollToTop();
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
}
