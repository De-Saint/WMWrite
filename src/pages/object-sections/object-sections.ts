import { Component } from '@angular/core';
import {  NavController, NavParams, ActionSheetController, LoadingController } from 'ionic-angular';
import { NewSectionPage } from '../new-section/new-section';
import { CommentsPage } from '../comments/comments';
import { AddTagPage } from '../add-tag/add-tag';
import { AddIndexPage } from '../add-index/add-index';
import { EditSectionPage } from '../edit-section/edit-section';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { ISections } from '../../models/Interface';


@Component({
  selector: 'page-object-sections',
  templateUrl: 'object-sections.html',
})
export class ObjectSectionsPage {
  parentid: any;
  parenttype: any;
  error: any;
  booksections: ISections[];
  nobksection: any;
  firstcount = 0;
  constructor(public navCtrl: NavController,
    public datalink: DatalinkProvider,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController, public navParams: NavParams) {
    this.parentid = this.navParams.get("parentid");
    this.parenttype = this.navParams.get("parenttype");
    this.getObjectSections(this.parentid, this.parenttype);
  }

  ionViewDidLoad() {

  }

  getObjectSections(parentid, parenttype) {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.getObjectSections(String(parentid), String(this.firstcount), parenttype).subscribe(booksections => {
      if (booksections[0] !== "200") {
        this.error = booksections[1];
        this.nobksection = "nobksection";
        loading.dismiss().catch(() => { });
      } else {
        this.booksections = booksections[1];
        console.log(this.booksections);
        loading.dismiss().catch(() => { });
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Error connecting to server");
    });

  }


  onSectionOption(sectionid, section) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Section Options',
      buttons: [
        {
          text: 'Check-Out And Edit Section',
          handler: () => {
            this.navCtrl.push(EditSectionPage, { section });
          }
        },
        {
          text: 'Add Sub-Section',
          handler: () => {
            this.navCtrl.push(NewSectionPage, { parentid: sectionid, parenttype: "Section" });
          }
        },
        {
          text: 'Add Comment',
          handler: () => {
            this.navCtrl.push(CommentsPage, { parentid: sectionid, parenttype: "Section" });
          }
        },
        {
          text: 'Add Tag',
          handler: () => {
            this.navCtrl.push(AddTagPage, { parentid: sectionid, parenttype: "Section" });
          }
        },
        {
          text: 'Add Index',
          handler: () => {
            this.navCtrl.push(AddIndexPage, { parentid: sectionid, parenttype: "Section" });
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
