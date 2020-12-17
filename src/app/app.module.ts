import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { HeaderColor } from '@ionic-native/header-color';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Market } from '@ionic-native/market';
import { AppVersion } from '@ionic-native/app-version';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Keyboard } from '@ionic-native/keyboard';

import { WMWrite } from './app.component';
import { DatalinkProvider } from '../providers/datalink/datalink';

import { HomePage } from '../pages/home/home';
import { BookDetailsPage } from '../pages/book-details/book-details';
import { BooksPage } from '../pages/books/books';
import { CommentsPage } from '../pages/comments/comments';
import { EditSectionPage } from '../pages/edit-section/edit-section';
import { GuidePage } from '../pages/guide/guide';
import { IndexesPage } from '../pages/indexes/indexes';
import { KeywordsPage } from '../pages/keywords/keywords';
import { LibraryPage } from '../pages/library/library';
import { LoginPage } from '../pages/login/login';
import { NewBookPage } from '../pages/new-book/new-book';
import { NewSectionPage } from '../pages/new-section/new-section';
import { ProfilePage } from '../pages/profile/profile';
import { SearchPage } from '../pages/search/search';
import { SectionDisplayPage } from '../pages/section-display/section-display';
import { TagsPage } from '../pages/tags/tags';
import { WmObjectsPage } from '../pages/wm-objects/wm-objects';
import { HomeTabPage } from '../pages/home-tab/home-tab';
import { TagDetailsPage } from '../pages/tag-details/tag-details';
import { ArticlesPage } from '../pages/articles/articles';
import { CatBooksPage } from '../pages/cat-books/cat-books';
import { AddTagPage } from '../pages/add-tag/add-tag';
import { AddIndexPage } from '../pages/add-index/add-index';
import { EditBookDetailsPage } from '../pages/edit-book-details/edit-book-details';
import { TableOfContentsPage } from '../pages/table-of-contents/table-of-contents';
import { BookMarksPage } from '../pages/book-marks/book-marks';
import { NewIndexPage } from '../pages/new-index/new-index';
import { BookMarkDetailsPage } from '../pages/book-mark-details/book-mark-details';
import { EditCommentPage } from '../pages/edit-comment/edit-comment';
import { ObjectTagsPage } from '../pages/object-tags/object-tags';
import { ObjectIndexesPage } from '../pages/object-indexes/object-indexes';
import { SyncHistoryPage } from '../pages/sync-history/sync-history';
import { CategoryPage } from '../pages/category/category';
import { ObjectBooksPage } from '../pages/object-books/object-books';
import { ObjectSectionsPage } from '../pages/object-sections/object-sections';

@NgModule({
  declarations: [
    WMWrite,
    HomePage,
    BookDetailsPage,
    BooksPage,
    CommentsPage,
    EditSectionPage,
    GuidePage,
    IndexesPage,
    KeywordsPage,
    LibraryPage,
    LoginPage,
    NewBookPage,
    NewSectionPage,
    ProfilePage,
    SearchPage,
    SectionDisplayPage,
    TagsPage,
    WmObjectsPage,
    HomeTabPage,
    TagDetailsPage,
    ArticlesPage,
    CatBooksPage,
    AddTagPage,
    AddIndexPage,
    EditBookDetailsPage,
    TableOfContentsPage,
    BookMarksPage,
    NewIndexPage,
    BookMarkDetailsPage,
    EditCommentPage,
    ObjectTagsPage,
    ObjectIndexesPage,
    SyncHistoryPage,
    CategoryPage,
    ObjectBooksPage,
    ObjectSectionsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(WMWrite),
    SuperTabsModule.forRoot(),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    WMWrite,
    HomePage,
    BookDetailsPage,
    BooksPage,
    CommentsPage,
    EditSectionPage,
    GuidePage,
    IndexesPage,
    KeywordsPage,
    LibraryPage,
    LoginPage,
    NewBookPage,
    NewSectionPage,
    ProfilePage,
    SearchPage,
    SectionDisplayPage,
    TagsPage,
    WmObjectsPage,
    HomeTabPage,
    TagDetailsPage,
    ArticlesPage,
    CatBooksPage,
    AddTagPage,
    AddIndexPage,
    EditBookDetailsPage,
    TableOfContentsPage,
    BookMarksPage,
    NewIndexPage,
    BookMarkDetailsPage,
    EditCommentPage,
    ObjectTagsPage,
    ObjectIndexesPage,
    SyncHistoryPage,
    CategoryPage,
    ObjectBooksPage,
    ObjectSectionsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HeaderColor,
    Market,
    AppVersion,
    Keyboard,
    BackgroundMode,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatalinkProvider
  ]
})
export class AppModule {}
