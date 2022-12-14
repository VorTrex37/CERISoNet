import {Component, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {StorageService} from "../../services/storage.service";
import {DatePipe} from "@angular/common";
import * as dayjs from "dayjs";
import * as customParsFormat from "dayjs/plugin/customParseFormat";
import * as relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr.js";
import {Socket} from "ngx-socket-io";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  providers: [DatePipe]
})
export class FeedbackComponent implements OnInit {

  baseURL = environment.baseURL;
  posts: any[] = [];
  users: any[] = [];
  comments: any[] = [];
  comment: boolean[] = [];
  answer: boolean[] = [];
  shared: boolean[] = [];
  p: number = 1;

  config: any;

  likes : boolean[] = []

  default: any = 'assets/img/default_avatar.png';

  selectFilter: any;

  selectSort: any;


  constructor(private httpClient: HttpClient,
              private router: Router,
              private storage: StorageService,
              private datePipe: DatePipe,
              private socket: Socket,
              private notifier: NotifierService) {
    dayjs.extend(customParsFormat)
    dayjs.extend(relativeTime)
    dayjs.locale('fr')
  }

  ngOnInit(): void {
    this.home()
    this.getPosts();
    this.getUsers();
  }

  home() {
    if (this.userConnected()) {
      this.router.navigateByUrl('')
    } else {
      this.router.navigateByUrl('login')
    }
  }

  // Récupération du token afin de vérifier la connexion de l'utilisateur
  userConnected() {
    return this.storage.getToken();
  }

  getPosts() {
    try {
      this.httpClient.get<any>(`${this.baseURL}posts`).subscribe(
        //Réception et Gestion des réponses valides
        async (res: any) => {
          if (res) {
            this.posts = res;

            for (let post of this.posts) {
              this.comments.push(post['comments']);
              this.likes.push(false);
              this.answer.push(true);
              this.shared.push(true);
            }
          }
        },
        //Réception et Gestion des réponses erreurs
        (error: any) => {
          console.log(error);
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  getUsers() {
    try {
      this.httpClient.get<any>(`${this.baseURL}users`).subscribe(
        //Réception et Gestion des réponses valides
        async (res: any) => {
          if (res) {
            this.users = res;
          }
        },
        //Réception et Gestion des réponses erreurs
        (error: any) => {
          console.log(error);
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  public showNotification(type: string, message: string): void {
    this.notifier.notify(type, message);
  }

  sendAnswer(form: any, postId: any, key: any) {
    try {
      if (!form.value.answer) {
        this.showNotification('info', 'Veuillez écrire un message')
        return;
      }

      const answer = form.value.answer
      const userData = this.storage.getUserDetails()
      const date = new Date();
      const shortDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      const shortTime = this.datePipe.transform(date, "shortTime")

      const comment = {
        id: postId,
        text: answer,
        commentedBy: userData._id,
        date: shortDate,
        hour: shortTime,
        status: 'comment'
      };

      const commentData = {
        text: answer,
        commentedBy: userData,
        date: shortDate,
        hour: shortTime,
      };

      this.comments[key].push(commentData);
      this.answer[key] = true;
      form.reset();

      this.httpClient.post<any>(`${this.baseURL}post/update/` + postId, comment).subscribe(
        //Réception et Gestion des réponses valides
        async (res: any) => {
          if (res) {
            this.showNotification('success', 'Envoi du commentaire réussi')
          }
        },
        //Réception et Gestion des réponses erreurs
        (error: any) => {
          if (error) {
            this.showNotification('error', "Echec de l'envoi du commentaire")
          }
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  getDateTime(date: any, hour: any) {
    if (!date || !hour) {

      return null;

    }

    const datePost = new Date(date + ' ' + hour);

    const longDate = this.datePipe.transform(datePost, "longDate");
    const shortTime = this.datePipe.transform(datePost, "shortTime");

    return longDate + ', ' + shortTime;
  }

  getDateNow(date: any, hour: any)
  {
    const datePost = date + ' ' + hour;

    return dayjs(datePost, "YYYY-MM-DD HH:mm").fromNow()
  }

  addLike(likes: number, key: number, postId: any) {
    try {
      if (this.likes[key])
      {
        const likes = {
          id: postId,
          status: 'likes_moins'
        };

        this.posts[key]["likes"]--;
        this.likes[key] = false;

        this.httpClient.post<any>(`${this.baseURL}post/update/` + postId, likes).subscribe(
          //Réception et Gestion des réponses valides
          async (res: any) => {
            console.log(res);
          },
          //Réception et Gestion des réponses erreurs
          (error: any) => {
            console.log(error);
          }
        );

      }
      else
      {
        const likes = {
          id: postId,
          status: 'likes_plus'
        };

        this.posts[key]["likes"]++;
        this.likes[key] = true

        this.httpClient.post<any>(`${this.baseURL}post/update/` + postId, likes).subscribe(
          //Réception et Gestion des réponses valides
          async (res: any) => {
            console.log(res);
          },
          //Réception et Gestion des réponses erreurs
          (error: any) => {
            console.log(error);
          }
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  getPostInfo(postId: any)
  {

    for (let post of this.posts)
    {
      if (post["_id"] === postId)
      {
        return post
      }
    }
  }

  sendShared(form : any, postId: any, sharePost: any) {

    try {
      if (sharePost) {
        this.showNotification('info', 'Impossible de partarger un post déja partagé')
        return;
      }

      if (!form.value.body) {
        this.showNotification('info', 'Veuillez écrire un message')
        return;
      }

      const body = form.value.body;
      const url = form.value.image_link;
      const title = form.value.image_title;
      const hashtags = form.value.hashtag.split(" ").filter((t: string) => t.charAt(0) === '#');
      const image = {
        url: url,
        title: title
      };
      const userData = this.storage.getUserDetails();
      const date = new Date();
      const shortDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      const shortTime = this.datePipe.transform(date, "shortTime")

      const shared = {
        date: shortDate,
        hour: shortTime,
        body: body,
        createdBy: userData._id,
        images: image,
        hashtags: hashtags,
        shared: postId,
      };

      const sharedData = {
        date: shortDate,
        hour: shortTime,
        body: body,
        createdBy: userData,
        Shared: this.getPostInfo(postId),
        images: image,
        hashtags: hashtags,
        likes: 0,
      };

      this.posts.push(sharedData);
      this.likes.push(false);
      this.answer.push(true);
      this.shared.push(true);

      form.reset();

      this.httpClient.post<any>(`${this.baseURL}post/create/`, shared).subscribe(
        //Réception et Gestion des réponses valides
        async (res: any) => {
          if (res) {
            this.showNotification('success', 'Création du post partagé réussi')
          }
        },
        //Réception et Gestion des réponses erreurs
        (error: any) => {
          if (error) {
            this.showNotification('error', 'Echec de la création du post partagé')
          }
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  getImage(image: any) {
    if (!image && !image.match(/^http.*.(jpeg|jpg|gif|png|svg|webp")$/)) {
      return this.default;
    }

    return image
  }

  verifPosts(post: any) {
    if (post["_id"] === undefined
      || post["date"] === undefined
      || post["images"] === undefined
      || post["hour"] === undefined
      || post["body"] === undefined
      || post["likes"] === undefined
    ) {
      return false
    } else {
      return true;
    }

  }

  verifComment(comment: any) {
    if (comment["text"] === undefined
      || comment["commentedBy"] === undefined
      || comment["hour"] === undefined
      || comment["date"] === undefined
    ) {
      return false
    } else {
      return true;
    }

  }

  filterPost()
  {
    try {

      const filter = {
        createdBy : this.selectFilter
      };


      this.httpClient.post<any>(`${this.baseURL}post/filter`, filter).subscribe(
        //Réception et Gestion des réponses valides
        async (res: any) => {
          if (res) {
            this.posts = res;

            this.comments = [];
            this.likes = [];
            this.answer =[];

            for (let post of this.posts) {
              this.comments.push(post['comments']);
              this.likes.push(false);
              this.answer.push(true);
              this.shared.push(true);
            }
          }
        },
        //Réception et Gestion des réponses erreurs
        (error: any) => {
          if (error) {
            this.showNotification('info', "L'utilisateur n'a fait aucun post")
          }
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  searchPost()
  {
    try {

      let sort;
      let createdBy;
      let search;

      if (this.selectFilter && this.selectFilter !== 'Retirer le filtre')
      {
        createdBy = this.selectFilter;
      }

      if ( this.selectSort == 1)
      {
          sort = 'date_young';

      }
      if (this.selectSort == 0)
      {
          sort = 'reset_sort';

      }
      if ( this.selectSort == 2)
      {
        sort = 'date_old'
      }
      if ( this.selectSort == 3)
      {

        sort = 'like_more'
      }
      if (this.selectSort == 4)
      {
        sort = 'like_less'
      }

      if(createdBy && sort)
      {
        search = {
          createdBy : createdBy,
          sort :  sort
        }
      }

      if(!createdBy && sort)
      {
        search = {
          sort :  sort
        }
      }

      if(createdBy && !sort)
      {
        search = {
          createdBy : createdBy,
        }
      }

      this.httpClient.post<any>(`${this.baseURL}post/search`, search).subscribe(
        //Réception et Gestion des réponses valides
        async (res: any) => {
          if (res) {
            this.posts = res;

            this.comments = [];
            this.likes = [];
            this.answer =[];

            for (let post of this.posts) {
              this.comments.push(post['comments']);
              this.likes.push(false);
              this.answer.push(true);
              this.shared.push(true);
            }
          }
        },
        //Réception et Gestion des réponses erreurs
        (error: any) => {
          if (error) {
            this.showNotification('error', "Une erreur est survenue")
          }
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  getUsersLogged() : any{
    return this.socket.fromEvent('users-logged');
  }

  verifShared(shared: any)
  {
    if (shared)
    {
      return true;
    }
    else
    {
      return false;
    }
  }
}
