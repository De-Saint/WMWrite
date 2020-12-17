import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { DatalinkProvider } from '../../providers/datalink/datalink';
import { IBooks, ITags, IIndexes } from '../../models/Interface';
import { BookDetailsPage } from '../book-details/book-details';
import { TagDetailsPage } from '../tag-details/tag-details';
import { NewIndexPage } from '../new-index/new-index';
import { ObjectTagsPage } from '../object-tags/object-tags';
import { ObjectIndexesPage } from '../object-indexes/object-indexes';
import { CommentsPage } from '../comments/comments';
import { SectionDisplayPage } from '../section-display/section-display';
import { BookMarksPage } from '../book-marks/book-marks';
import { ObjectSectionsPage } from '../object-sections/object-sections';
import { ObjectBooksPage } from '../object-books/object-books';


@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  searchTerm: string = '';
  searching: any = false;
  toggled: boolean;

  originalbooks: any;
  nobooks: any;
  error: any;
  allbooks: IBooks[];
  books: IBooks[];
  bookcount: any;

  tags: ITags[];
  notags: any;
  alltags: ITags[];
  tagcount: string;
  tgcount: string;
  originaltags: any;

  articles: IBooks[];
  articlecount: any;
  artcount: any;
  originalarticles: any;

  SEARCH: string;

  indexes: IIndexes[];
  noindexes: any;
  indexcount: any;
  originalindexes: any;

  code: any;
  constructor(public datalink: DatalinkProvider,
    public navCtrl: NavController, public loadingCtrl: LoadingController,
    public navParams: NavParams) {
    this.SEARCH = "books";
  }

  ionViewDidLoad() {
  }
  onClear(ev) {
    this.searchTerm = "";
    this.books = [];
    this.tags = [];
    this.indexes = [];
  }
  onCancel(ev) {
    this.searchTerm = "";
    this.books = [];
    this.tags = [];
    this.indexes = [];
  }
  BookSearch() {
    this.SEARCH = "books";
    this.GlobalSearch();

  }
  ArticlesSearch() {
    this.SEARCH = "articles";
    this.GlobalSearch();

  }
  TagsSearch() {
    this.SEARCH = "tags";
    this.GlobalSearch();

  }
  IndexSearch() {
    this.SEARCH = "indexes";
    this.GlobalSearch();
  }
  GlobalSearch() {
    let loading = this.loadingCtrl.create({

    });

    var search = this.searchTerm;
    if (search.trim().length >= 3) {
      let firstCount = "0";
      loading.present();
      this.datalink.GetBooks(firstCount, search, "A-Z").subscribe(books => {
        if (books[0] === "400") {
          this.error = books[1];
          this.nobooks = "nobooks";
          this.books = [];
          loading.dismiss().catch(() => { });
        } else {
          this.books = books[1];
          this.bookcount = this.books[0].count;
          this.originalbooks = books[1];
          loading.dismiss().catch(() => { });
        }
      }, (err) => {
        loading.dismiss().catch(() => { });
        this.datalink.showToast('bottom', "Error connecting to server");
        return false;
      });

      this.datalink.GetArticles(firstCount, search, "A-Z").subscribe(articles => {
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
        this.datalink.showToast('bottom', "Loading your offline Books");
        return false;
      });

      this.datalink.GetTags(firstCount, search).subscribe(tags => {
        if (tags[0] === "400") {
          this.error = tags[1];
          this.notags = "notags";
          this.tags = [];
          this.originaltags = [];
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

      this.datalink.GetIndexes(firstCount, search).subscribe(indexes => {
        this.code = indexes[0];

        if (indexes[0] === "400") {
          this.error = indexes[1];
          this.noindexes = "noindexes";
          this.indexes = [];
          loading.dismiss().catch(() => { });
        } else {
          this.indexes = indexes[1];
          console.log(indexes[1]);
          this.indexcount = this.indexes[1].count;
          this.originalindexes = indexes[1];
          loading.dismiss().catch(() => { });
        }
      }, (err) => {
        this.datalink.showToast('bottom', "Error connecting to server");
        return false;
      });

    }
  }

  OpenBook(bookid) {
    this.navCtrl.push(BookDetailsPage, { bookid });
  }
  OpenTag(tag) {
    this.navCtrl.push(TagDetailsPage, { tagdetails: tag });
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

  OpenIndex(index) {
    this.navCtrl.push(NewIndexPage, {
      index,
      indextype: "editIndex"
    })
  }

  onOpenIndexTags(indexid) {
    this.navCtrl.push(ObjectTagsPage, { parentid: indexid, parenttype: "index" });
  }
  onOpenIndexBookMarks(indexid) {
    this.navCtrl.push(BookMarksPage, { parentid: indexid, parenttype: "index" });
  }
  onOpenIndexComments(indexid) {
    this.navCtrl.push(CommentsPage, { parentid: indexid, parenttype: "index" });
  }
  onOpenIndexSections(indexid) {
    this.navCtrl.push(ObjectSectionsPage, { parentid: indexid, parenttype: "index" });
  }
  onOpenIndexBooks(indexid) {
    this.navCtrl.push(ObjectBooksPage, { parentid: indexid, parenttype: "index" });
  }

}
