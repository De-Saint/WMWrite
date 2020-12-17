import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, LoadingController, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IBooks } from '../../models/Interface';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { SectionDisplayPage } from '../section-display/section-display';
import { CommentsPage } from '../comments/comments';
import { AddIndexPage } from '../add-index/add-index';
import { EditBookDetailsPage } from '../edit-book-details/edit-book-details';
import { NewSectionPage } from '../new-section/new-section';
import { AddTagPage } from '../add-tag/add-tag';
import { ObjectIndexesPage } from '../object-indexes/object-indexes';
import { ObjectTagsPage } from '../object-tags/object-tags';


@Component({
  selector: 'page-book-details',
  templateUrl: 'book-details.html',
})
export class BookDetailsPage {
  bookid: any;
  userid: string;
  UDetails: any;
  book: IBooks;
  newtitle: string;
  books: IBooks[];
  username: any;
  id: any;
  nobooks: any;
  bookcount: any;
  error: any;
  optionText: any;
  originalbooks: any;
  constructor(public toastCtrl: ToastController, public storage: Storage,
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController,
    public datalink: DatalinkProvider,
    public navParams: NavParams) {
    this.bookid = this.navParams.get("bookid");
    let loading = this.loadingCtrl.create({

    });
    loading.present();
    this.getBookDetails(this.bookid, loading);
    this.GetBooks("Recent");
  }

  ionViewDidLoad() {
  }
  getBookDetails(id, loading) {
    this.onlineBkDetails(id, loading);

  }

  onlineBkDetails(id, loading) {
    this.datalink.GetBookDetails(String(id)).subscribe(books => {
      this.book = books;
      console.log(this.book);
      loading.dismiss().catch(() => { });
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Error connecting to server");
    });
  }
  onOpenBook() {
    this.navCtrl.push(SectionDisplayPage, { bookid: this.bookid });
  }
  onOpenTags() {
    this.navCtrl.push(ObjectTagsPage, { parentid: this.bookid, parenttype: "Book" });
  }
  onOpenIndex() {
    this.navCtrl.push(ObjectIndexesPage, { parentid: this.bookid, parenttype: "Book" });
  }
  onOpenComments() {
    this.navCtrl.push(CommentsPage, { parentid: this.bookid, parenttype: "Book" });
  }
  onOpenSections() {
    this.navCtrl.push(SectionDisplayPage, { bookid: this.bookid });
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
      if (books[0] === "400") {
        this.error = books[1];
        this.nobooks = "nobooks";
      } else {
        this.books = books[1];
        this.bookcount = this.books[0].count;
        this.originalbooks = books[1];
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Loading your offline Books");
      return false;
    });
  }

  OpenBook(bookid) {
    let loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loading.present();
    this.bookid = bookid;
    this.getBookDetails(bookid, loading);
    this.GetBooks("Recent");
  }


  OpenBookAction() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Book Options',
      buttons: [
        {
          text: 'View/Edit Book Details',
          handler: () => {
            this.navCtrl.push(EditBookDetailsPage, {
              bookid: this.bookid, bookdetails: this.book
            });
          }
        },
        {
          text: 'Add Section',
          handler: () => {
            this.navCtrl.push(NewSectionPage, {
              parentid: this.bookid,
              parenttype: "Book"
            });
          }
        },
        {
          text: 'Add Comment',
          handler: () => {
            this.navCtrl.push(CommentsPage, {
              parentid: this.bookid,
              parenttype: "Book"
            });
          }
        },
        {
          text: 'Add Tag',
          handler: () => {
            this.navCtrl.push(AddTagPage, {
              parentid: this.bookid,
              parenttype: "Book"
            });
          }
        },
        {
          text: 'Add Index',
          handler: () => {
            this.navCtrl.push(AddIndexPage, {
              parentid: this.bookid,
              parenttype: "Book"
            })
          }
        },
        {
          text: 'Delete Book',
          handler: () => {
            this. onDeleteBook(this.bookid);
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
  onDeleteBook(bookid) {
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Delete Book',
      message: 'Are you sure you want to Delete this Book including its relationships?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log("cancelled");
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.storage.ready().then(() => {
              this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
                if (loggedInUserDetails == null) {
                } else {
                  this.UDetails = loggedInUserDetails[1];
                  this.userid = this.UDetails.userid;
                  loading.present();
                  this.datalink.DeleteBook(String(bookid), String(this.userid)).subscribe(msg => {
                    if (msg === "successful") {
                      this.datalink.showToast('bottom', "Successful");
                      this.navCtrl.pop();
                    } else {
                      this.datalink.showToast('bottom', "Error something went wrong");
                      loading.dismiss().catch(() => { });
                    }
                  }, (err) => {
                    loading.dismiss().catch(() => { });
                    this.datalink.showToast("bottom", "Error Deleting Book, please try again");
                    return false;
                  });
                }
              });
            });

          }
        }
      ]
    });
    confirm.present();
  }


}
