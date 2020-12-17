import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { IArticlesjoin } from '../../models/Interface';
import { DatalinkProvider } from '../../providers/datalink/datalink';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-new-section',
  templateUrl: 'new-section.html',
})
export class NewSectionPage {
  parentid: any;
  parenttype: any;
  clipid: any;
  userid: string;
  UDetails: any;
  ChildSectionID: IArticlesjoin[];

  bk: {
    sntitle?: string
    sncontent?: string
  } = {};
  constructor(
    public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    public datalink: DatalinkProvider, public storage: Storage, public navCtrl: NavController, public navParams: NavParams) {
    this.parentid = this.navParams.get("parentid");
    this.parenttype = this.navParams.get("parenttype");
  }

  ionViewDidLoad() {
    console.log(this.parentid);
    console.log(this.parenttype);
  }
  onSave() {
    var sectiontitle = this.bk.sntitle;
    var sectioncontent = this.bk.sncontent;
    if (sectiontitle === null || sectiontitle === "") {
      this.datalink.showToast('bottom', "Please fill Section Title");
      return false
    }
    if (sectioncontent === null || sectioncontent === "") {
      this.datalink.showToast('bottom', "Please fill Section Content");
      return false
    }

    // if (Network.type === "none") {
    // this.SaveOfflineSection(sectioncontent, sectiontitle, loadedType, this.bookid);
    //  } else{
    var timestamp = new Date().getMilliseconds().toString();
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.SaveOnlineSection(timestamp, 0, sectiontitle, sectioncontent, this.parenttype, String(this.parentid), loading);
    // }
  }

  SaveOnlineSection(random, count, sectionTitle, content, loadedType, LoadedID, loading) {
    var done = "no";
    var x = 5000;
    var weight = content.length;
    if (weight < x) {
      x = weight;
    }
    var currentContent = content.substr(count, x);
    count = count + currentContent.length;
    var next = content.substr(count, count + x);
    if (next === "") {
      done = "yes";
    }
    this.AddSection(LoadedID, loadedType, sectionTitle, currentContent, random, count, done, content, loading);
  }
  AddSection(LoadedID, loadedType, sectionTitle, currentContent, random, count, done, content, loading) {
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
          return false;
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userId;
          this.datalink.AddSection(LoadedID, loadedType, sectionTitle, currentContent, random, String(count), done, this.userid).subscribe(msg => {
            let message = msg;
            if (message[1] === "finished") {
              this.datalink.showToast('bottom', "Successful");
              this.navCtrl.pop();
              loading.dismiss().catch(() => { });
            } else if (message[1] === "failed") {
              this.datalink.showToast('bottom', "Error something went wrong");
              loading.dismiss().catch(() => { });
            } else {
              this.SaveOnlineSection(random, count, sectionTitle, content, loadedType, LoadedID, loading)
            }
          }, (err) => {
            loading.dismiss().catch(() => { });
            this.datalink.showToast('bottom', "Error connecting to server");
            return false;
          });
        }
      });
    });

  }
  ///---------------------------------Save Section Offline -----------------------------------------------------
  // SaveOfflineSection(sectioncontent, sectiontitle, loadedType, LoadedID) {
  //   var newsectionid = new Date().getMilliseconds().toString();
  //   var datecreated = this.dataservice.getDate();
  //   var status = "none";
  //   this.dataservice.setSections(newsectionid, sectiontitle, sectioncontent, 0, datecreated, this.booktitle, this.bookid, status);
  //   var articleid = new Date().getMilliseconds().toString();
  //   this.dataservice.setArticlesjoin(articleid, 1, loadedType, "Section", LoadedID, newsectionid, 1);
  //   this.UpdateSectionIndexNumbers(LoadedID, loadedType, newsectionid);

  // }
  // UpdateSectionIndexNumbers(parentID, parentType, newsectionid) {
  //   this.ChildSectionID = [];
  //   this.dataservice.getOfflineArtJoinById(parentType, parentID).then((result) => {
  //     if (result.res.rows.length > 0) {
  //       var totalSectionIndexNumber = result.res.rows.length;
  //       var newSectIndexNumber = 0;
  //       newSectIndexNumber = totalSectionIndexNumber + 1;
  //       this.dataservice.updateSectionIndexNumber(newsectionid, newSectIndexNumber);
  //       this.datalink.showToast('bottom', "Successful");
  //       let bookid = this.bookid;
  //       let title = this.booktitle;
  //       this.navCtrl.setRoot(BookSectionsPage, { bookid, title });
  //     }
  //   });
  // }
  // SaveOfflineSubSection(sectioncontent, sectiontitle, loadedType, LoadedID) {
  //   var newsectionid = new Date().getMilliseconds().toString();
  //   var datecreated = this.dataservice.getDate();
  //   this.dataservice.setSections(newsectionid, sectiontitle, sectioncontent, 0, datecreated, this.booktitle, this.bookid, status
  //   );
  //   var articleid = new Date().getMilliseconds().toString();
  //   this.dataservice.setArticlesjoin(articleid, 1, loadedType, "Section", LoadedID, newsectionid, 1);
  //   this.UpdateSubSectionIndexNumbers(LoadedID, loadedType, newsectionid);

  // }
  // UpdateSubSectionIndexNumbers(parentID, parentType, newsectionid) {
  //   this.ChildSectionID = [];
  //   this.dataservice.getOfflineArtJoinById(parentType, parentID).then((result) => {
  //     if (result.res.rows.length > 0) {
  //       var totalSubSectionIndexNumber = result.res.rows.length;
  //       this.dataservice.getOfflineSectionDetails(parentID).then((result) => {
  //         if (result.res.rows.length > 0) {
  //           let parentsectindexNumber = result.res.rows[0].IndexNumber;
  //           var newsubSectIndexNumber = 0;
  //           var currentindex = newsubSectIndexNumber + totalSubSectionIndexNumber;
  //           var newsubSectIndexnumber = parentsectindexNumber + "." + currentindex;
  //           this.dataservice.updateSectionIndexNumber(newsectionid, newsubSectIndexnumber);
  //           this.datalink.showToast('bottom', "Successful");
  //           this.navCtrl.setRoot(BooksPage);
  //         }
  //       })
  //     } else {
  //       this.dataservice.getOfflineSectionDetails(parentID).then((result) => {
  //         if (result.res.rows.length > 0) {
  //           var parentsectindexNumber = result.res.rows[0].IndexNumber;
  //           var newsubSectIndexnumber = parentsectindexNumber + ".1";
  //           this.dataservice.updateSectionIndexNumber(newsectionid, newsubSectIndexnumber);
  //           this.datalink.showToast('bottom', "Successful");
  //           this.navCtrl.setRoot(BooksPage);
  //         }
  //       })
  //     }
  //   });
  // }





}
