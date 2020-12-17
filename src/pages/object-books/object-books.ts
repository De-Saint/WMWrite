import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, Content } from 'ionic-angular';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { IBooks } from '../../models/Interface';
import { BookDetailsPage } from '../book-details/book-details';
import { ObjectTagsPage } from '../object-tags/object-tags';
import { ObjectIndexesPage } from '../object-indexes/object-indexes';
import { CommentsPage } from '../comments/comments';
import { SectionDisplayPage } from '../section-display/section-display';

@Component({
  selector: 'page-object-books',
  templateUrl: 'object-books.html',
})
export class ObjectBooksPage {
  parentid: any;
  parenttype: any;
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
  firstCount = "0";
  searching: any = false;
  loadingProgress: any;
  constructor(public navCtrl: NavController,
    public datalink: DatalinkProvider,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {

    this.parentid = this.navParams.get("parentid");
    this.parenttype = this.navParams.get("parenttype");
    this.GetObjectBooks(this.parentid, this.parenttype);
  }

  ionViewDidLoad() {

  }
  OpenBook(bookid) {
    this.navCtrl.push(BookDetailsPage, { bookid });
  }


  GetObjectBooks(parentid, parenttype) {
    let loading = this.loadingCtrl.create({
    });
    loading.present();

    this.datalink.getObjectBooks(parentid, String(this.firstCount), parenttype).subscribe(books => {
      loading.dismiss().catch(() => { });
      if (books[0] === "400") {
        this.error = books[1];
        this.nobooks = "nobooks";
        loading.dismiss().catch(() => { });
      } else {
        this.books = books[1];
        console.log(this.books);
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
      this.loadingProgress = 1;
      this.datalink.getObjectBooks(this.parentid, String(firstCount), this.parenttype).subscribe(books => {
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
    this.GetObjectBooks(this.parentid, this.parenttype);
  }
  onCancel(ev) {
    this.searchTerm = "";
    this.GetObjectBooks(this.parentid, this.parenttype);
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
          this.datalink.getObjectBooks(this.parentid, String(this.firstcount), this.parenttype).subscribe(newbooks => {
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
