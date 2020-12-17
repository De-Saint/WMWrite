import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CatBooksPage } from '../cat-books/cat-books';
import { DatalinkProvider } from '../../providers/datalink/datalink';


@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  rootNavCtrl: NavController;
  bookcategory: any;
  constructor( public datalink: DatalinkProvider,  public navCtrl: NavController, public navParams: NavParams) {
    this.getBookCategory();
    this.rootNavCtrl = this.navParams.get('rootNavCtrl');
 
  }
  getBookCategory() {
    this.datalink.getBookCategory().subscribe(bookcategory => {
      this.bookcategory = bookcategory;
      console.log(this.bookcategory)
    }, (err) => {
      return false;
    });
  }
  ionViewDidLoad() {
  }

 

  OpenBookCat(catid){
    this.navCtrl.push(CatBooksPage, {catid});
  }


}
