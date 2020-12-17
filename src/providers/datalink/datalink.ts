import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';
import { Platform, AlertController, ToastController } from 'ionic-angular';
import { map } from 'rxjs/operators';
import { IBooks, ISections, ITags, IIndexes, IComments, IClips, ILoginUser } from '../../models/Interface'


@Injectable()
export class DatalinkProvider {
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_WELCOME = 'hasSeenWelcome';
  // baseUrl: string = 'http://498041d1.ngrok.io/WMarketWrite/';
  // baseUrl: string = 'http://localhost:8084/WMarketWrite/';
  baseUrl: string = 'https://thewealthmarket.com/WMarketWrite/';
  constructor(public alertCtrl: AlertController,
    public platform: Platform,
    public http: HttpClient, public storage: Storage,
    public toastCtrl: ToastController, ) {

  }

  hasLoggedIn() {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };
  checkHasSeenWelcome() {
    return this.storage.get(this.HAS_SEEN_WELCOME).then((value) => {
      return value;
    })
  };
  SetloggedInUserDetails(loggedInUserDetails) {
    this.storage.set('loggedInUserDetails', loggedInUserDetails);
  };
  getloggedInUserDetails() {
    return this.storage.get('loggedInUserDetails').then((value) => {
      return value;
    });
  };

  showToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      closeButtonText: 'Ok',
      duration: 4000,
      position: position
    });
    toast.present(toast);
  }

  displayAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  login(emailphone: string, password: string) {
    let loginurl = this.baseUrl + 'MBookServlet';
    let type = "Login";
    let logindata = JSON.stringify({ emailphone, password, type });
    console.log(logindata);
    return this.http.post(loginurl, logindata)
      .pipe(map(res => { return <ILoginUser[]>res; }));
  }

  GetCatBooksOrArticles(count: string, search: string, filtervalue: string, catid: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "GetCatBooksOrArticles";
    let data = JSON.stringify({ type, catid, count, search, filtervalue });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }

  GetBooks(count: string, search: string, filtervalue: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "GetBooks";
    let data = JSON.stringify({ type, count, search, filtervalue });
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }

  GetArticles(count: string, search: string, filtervalue: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "GetArticles";
    let data = JSON.stringify({ type, count, search, filtervalue });
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  
  GetTags(count: string, search: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "GetTags";
    let data = JSON.stringify({ type, count, search });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return <ITags>res; }));
  }
  GetIndexes(count: string, search: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "GetIndexes";
    let data = JSON.stringify({ type, count, search });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  getBookCategory() {
    let url = this.baseUrl + 'MBookServlet';
    let type = "getBookCategory";
    let data = JSON.stringify({ type });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  getBooks(count: string, filtervalue: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "GetBooks";
    let data = JSON.stringify({ type, count, filtervalue });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return <IBooks>res; }));
  }
  getArticles(count: string, filtervalue: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "GetArticles";
    let data = JSON.stringify({ type, count, filtervalue });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return <IBooks>res; }));
  }

  getTags(count: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "GetTags";
    let data = JSON.stringify({ type, count });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return <ITags>res; }));
  }

  getIndexes(count: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "GetIndexes";
    let data = JSON.stringify({ type, count });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  Logout(userid) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "Logout";
    let data = JSON.stringify({ type, userid });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  DeleteTag(id: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "DeleteTag";
    let data = JSON.stringify({ type, id });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  AddTag(name: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "AddTag";
    let data = JSON.stringify({ type, name });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }

  AddTagToObject(tagid: string, objectid: string, objecttype) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "AddTagToObject";
    let data = JSON.stringify({ type, tagid, objectid, objecttype });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }

  UpdateTag(id: string, name: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "UpdateTag";
    let data = JSON.stringify({ type, id, name });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }

  GetBookDetails(bookid: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "GetBookDetails";
    let data = JSON.stringify({ type, bookid });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return <IBooks>res; }));
  }

  GetSections(count: string, search: string, filtervalue: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "GetSections";
    let data = JSON.stringify({ type, count, search, filtervalue });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return <ISections>res; }));
  }
  CheckSectionAvailability(userid, sectionid) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "CheckSectionAvailability";
    let data = JSON.stringify({ type, userid, sectionid });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  DeleteBook(userid, bookid) {
    let url = this.baseUrl + 'MBookServlet1';
    let type = "DeleteBook";
    let data = JSON.stringify({ type, userid, bookid });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }


  GetKeywords(count: string, search: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "GetKeywords";
    let data = JSON.stringify({ type, count, search });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  getKeywords(count: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "GetKeywords";
    let data = JSON.stringify({ type, count });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }

  GetSectionDetails(sectionid: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "GetSectionDetails";
    let data = JSON.stringify({ type, sectionid });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return <ISections>res; }));
  }

  GetClipDetails(bookmarkid: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "GetClipDetails";
    let data = JSON.stringify({ type, bookmarkid });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return <IClips>res; }));
  }

  GetBookSections(bookid: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "GetBookSections";
    let data = JSON.stringify({ type, bookid });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return <IBooks>res; }));
  }

  getObjectTags(objectid, count, objecttype) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "GetObjectTags";
    let data = JSON.stringify({ type, objectid, count, objecttype });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  getObjectSections(objectid, count, objecttype) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "GetObjectSections";
    let data = JSON.stringify({ type, objectid, count, objecttype });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  getObjectClips(objectid, count, objecttype) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "GetObjectClips";
    let data = JSON.stringify({ type, objectid, count, objecttype });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  getObjectBooks(objectid, count, objecttype) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "GetObjectBooks";
    let data = JSON.stringify({ type, objectid, count, objecttype });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  GetObjectIndexes(objectid: string, count: string, objecttype) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "GetObjectIndexes";
    let data = JSON.stringify({ type, objectid, count, objecttype });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return <IIndexes>res; }));
  }

  GetSectionContent(sectionid: string, count: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "GetSectionContent";
    let data = JSON.stringify({ type, sectionid, count });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  UpdateBookDetail(userid: string, bookid: string, booktitle: string, booksummary: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "UpdateBookDetail";
    let data = JSON.stringify({ type, userid, bookid, booktitle, booksummary });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return <IBooks>res; }));
  }
  UpdateSection(sectionid, sectionName, sectionContent, done, userid, latestversion) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "UpdateSection";
    let data = JSON.stringify({ type, sectionid, sectionName, sectionContent, done, userid, latestversion });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }

  UpdateSectionName(id: string, name: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "UpdateSectionName";
    let data = JSON.stringify({ type, id, name });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  UpdateComment(commentid, comment) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "UpdateComment";
    let data = JSON.stringify({ type, commentid, comment });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  UpdateIndex(IndexId: string, IndexHeader: string, SubHeader: string, IndexBody: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "UpdateIndex";
    let data = JSON.stringify({ type, IndexId, IndexHeader, SubHeader, IndexBody });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  AddIndex(header: string, subheader: string, body: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "AddIndex";
    let data = JSON.stringify({ type, header, subheader, body });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  UpdateKeyword(keyid: string, keyword: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "UpdateKeyword";
    let data = JSON.stringify({ type, keyid, keyword });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  CreateBook(userid, bktitle, bkcontent, bkcategory, isArticle) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "CreateBook";
    let data = JSON.stringify({ type, userid, bktitle, bkcontent, bkcategory, isArticle });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }

  Postclip(objectid: string, objecttype: string, userid: string, bkmkText: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "postclip";
    let data = JSON.stringify({ type, objectid, objecttype, userid, bkmkText });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return <IClips>res; }));
  }
  AddComment(loadedId, loadedType, comment, userid) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "AddComment";
    let data = JSON.stringify({ type, loadedId, loadedType, comment, userid });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  AddSection(loadedId, loadedType, sectionTitle, sectionContent, random, count, done, userid) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "AddSection";
    let data = JSON.stringify({ type, loadedId, loadedType, sectionTitle, sectionContent, random, count, done, userid });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  AddIndexTo(header: string, subheader: string, body: string, loadedType: string, loadedId: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "AddIndexTo";
    let data = JSON.stringify({ type, header, subheader, body, loadedType, loadedId });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }

  DeleteSection(id: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "DeleteSection";
    let data = JSON.stringify({ type, id });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }


  UnlinkTag(id: string, objecttype) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "UnlinkTag";
    let data = JSON.stringify({ type, id, objecttype });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }

  AddKeyword(name: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "AddKeyword";
    let data = JSON.stringify({ type, name });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  DeleteKeyword(id: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "DeleteKeyword";
    let data = JSON.stringify({ type, id });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  getBookTitle(id: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "getBookTitle";
    let data = JSON.stringify({ type, id });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  SwapSection(id: string, command: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "SwapSections";
    let data = JSON.stringify({ type, id, command });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  promoteSection(id: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "promoteSection";
    let data = JSON.stringify({ type, id });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  demoteSection(id: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "demoteSection";
    let data = JSON.stringify({ type, id });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  moveObject(loadedtype: string, loadedid: string, selectedtype: string, selectedid: string) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "MoveObject";
    let data = JSON.stringify({ type, loadedtype, loadedid, selectedtype, selectedid });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  GetObjectComments(objectid: string, count: string, objecttype) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "GetObjectComments";
    let data = JSON.stringify({ type, objectid, count, objecttype });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return <IComments>res; }));
  }


  DeleteObjectComment(objectid, objecttype) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "DeleteObjectComment";
    let data = JSON.stringify({ type, objectid, objecttype });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }


  DeleteIndex(indexid, objecttype) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "DeleteIndex";
    let data = JSON.stringify({ type, indexid, objecttype });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }

  CommentLikesAndDislikes(commentID, commentType) {
    let url = this.baseUrl + 'MBookServlet';
    let type = "CommentLikesAndDislikes";
    let data = JSON.stringify({ type, commentID, commentType });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return res; }));
  }
  //----------------------------------------------------------------------OfflineData-------------------------------------------//

  DowloadBookDetails(bookid: string) {
    let url = this.baseUrl + 'MBookOfflineServlet';
    let type = "DowloadBookDetails";
    let data = JSON.stringify({ type, bookid });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return <IBooks>res; }));
  }
  DowloadBookTags(id: string) {
    let url = this.baseUrl + 'MBookOfflineServlet';
    let type = "DowloadBookTags";
    let data = JSON.stringify({ type, id });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return <ITags>res; }));
  }
  DownloadBookComment(id: string) {
    let url = this.baseUrl + 'MBookOfflineServlet';
    let type = "DownloadBookComments";
    let data = JSON.stringify({ type, id });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return <IComments>res; }));
  }

  DowloadSectionIDs(id: string) {
    let url = this.baseUrl + 'MBookOfflineServlet';
    let type = "DowloadSectionIDs";
    let data = JSON.stringify({ type, id });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return <ISections>res; }));
  }
  DownloadSectionContent(sectionid: string, count: string) {
    let url = this.baseUrl + 'MBookOfflineServlet';
    let type = "DownloadSectionContent";
    let data = JSON.stringify({ type, sectionid, count });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return <ISections>res; }));
  }
  DownloadBookIndexes(id: string, count: string) {
    let url = this.baseUrl + 'MBookOfflineServlet';
    let type = "DownloadBookIndexes";
    let data = JSON.stringify({ type, id, count });
    console.log(data);
    return this.http.post(url, data)
      .pipe(map(res => { return <IIndexes>res; }));
  }



}
