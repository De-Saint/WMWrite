import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, LoadingController } from 'ionic-angular';
import { IBooks } from '../../models/Interface';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { BookDetailsPage } from '../book-details/book-details';
import { ObjectIndexesPage } from '../object-indexes/object-indexes';
import { ObjectTagsPage } from '../object-tags/object-tags';
import { CommentsPage } from '../comments/comments';
import { SectionDisplayPage } from '../section-display/section-display';

@Component({
  selector: 'page-cat-books',
  templateUrl: 'cat-books.html',
})
export class CatBooksPage {
  Objects: string;
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
  catid: any;
  constructor(public navCtrl: NavController,
    public datalink: DatalinkProvider,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
    this.catid = this.navParams.get("catid");
    this.GetBooks("A-Z", this.catid);
  }

  ionViewDidLoad() {

  }
  OpenBook(bookid) {
    this.navCtrl.push(BookDetailsPage, { bookid });
  }
  GetBooks(filter, catid) {
    this.GetRemoteBooks(filter, catid);
  }
  GetRemoteBooks(filter, catid) {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    let firstCount = "0";
    var search = "";
    this.datalink.GetCatBooksOrArticles(firstCount, search, filter, String(catid)).subscribe(books => {
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
      this.datalink.GetCatBooksOrArticles(firstCount, search, "A-Z", this.catid).subscribe(books => {
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
    this.GetBooks("A-Z", this.catid);
  }
  onCancel(ev) {
    this.searchTerm = "";
    this.GetBooks("A-Z", this.catid);
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
    this.navCtrl.push(ObjectTagsPage, { parentid: bookid, parenttype: "Book" });
  }
  onOpenIndex(bookid) {
    this.navCtrl.push(ObjectIndexesPage, { parentid: bookid, parenttype: "Book" });
  }
  onOpenComments(bookid) {
    this.navCtrl.push(CommentsPage, { parentid: bookid, parenttype: "Book" });
  }
  onOpenSections(bookid) {
    this.navCtrl.push(SectionDisplayPage, { bookid: bookid });
  }
}
