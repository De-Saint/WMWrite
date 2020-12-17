export interface IArticlesjoin {
    id: number;
    LinkId: any;
    ItemOneType: any;
    ItemTwoType: any;
    ItemOneId: any;
    ItemTwoId: any;
    ThreadId: any;
    count:any;
}

export interface IBooksCategory{
    id: number;
    name:any;
}

export interface IBooks {
    id: number;
    subject:any;
    Title: any;
    Summary: any;
    DateCreated: any;
    LastEdit: any;
    EditorID: any;
    Overview: any;
    LEdit:any;
    count:any;
    editorName: any;
    BookName:any;
    IndexNumber:any;
    parent:any;
    parenttype:any;
    LEditDate: any;
    LEditTime:any;
    Category: any;
    IsArticle:any;
    LastEditorsID:any;
    LastUpdated:any;

}
export interface IClips {
    id: number;
    object_type:any;
    object_id:any;
    member_id:any;
    Date:any;
    count: any;

}
export interface IComments {
    id: number;
    comment: any;
    userId: any;
    username: any;
    date: any;
    time: any;
    count:any;
    likes:any;
    dislikes:any;
    subcomments:any;
    replies:any;
}
export interface IIndexes {
    id: number;
    header:any;
    subheader:any;
    body_text: any;
    count: any;
}
export interface ILoginUser{
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}
export interface ISections {
    id: number;
    Name:any;
    Content:any;
    IndexNumber: any;
    last_edited:any;
    count: any;
    LastEdit: any;
    LastUpdated:any;
    BookTitle:any;
    BookID:any;
    latestVersion:any;
    status:any;
}
export interface ITags {
    id: number;
    name: any;
    count:any;
    title:any;
    tag_group_id:any;
}
