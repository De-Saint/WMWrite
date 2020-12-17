import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SuperTabs, SuperTabsController } from 'ionic2-super-tabs';
import { BooksPage } from '../books/books';
import { ArticlesPage } from '../articles/articles';
import { TagsPage } from '../tags/tags';
import { IndexesPage } from '../indexes/indexes';

@Component({
  selector: 'page-wm-objects',
  templateUrl: 'wm-objects.html',
})
export class WmObjectsPage {

  pages = [
    { pageName: BooksPage, title: 'Books', icon: 'book', id: 'bookTab' },
    { pageName: ArticlesPage, title: 'Articles', icon: 'book', id: 'articlesTab' },
    { pageName: TagsPage, title: 'Tags', icon: 'pricetags', id: 'tagsTab' },
    { pageName: IndexesPage, title: 'Indexes', icon: 'paper', id: 'indexesTab' }
  ];

  selectedTab = 0;

  @ViewChild(SuperTabs) superTabs: SuperTabs;

  constructor(
    public superTabsCtrl: SuperTabsController,
    public navCtrl: NavController, public navParams: NavParams) {

  }

  onTabSelect(ev: any) {
    this.selectedTab = ev.index;
  }

  ionViewDidLoad() {
    
  }
  

}
