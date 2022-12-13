export class Post {
    constructor(id, date, body, hour, createdBy, shared, images, likes, hashtags, comments) {
        this._id = id;
        this._date = date;
        this._body = body;
        this._hour = hour;
        this._shared = shared;
        this._images = images;
        this._likes = likes;
        this._hashtags = hashtags;
        this._comments = comments;
        this._createdBy = createdBy;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }

    get body() {
        return this._body;
    }

    set body(value) {
        this._body = value;
    }

    get hour() {
        return this._hour;
    }

    set hour(value) {
        this._hour = value;
    }

    get createdBy() {
        return this._createdBy;
    }

    set createdBy(value) {
        this._createdBy = value;
    }

    get shared() {
        return this._shared;
    }

    set shared(value) {
        this._shared = value;
    }

    get images() {
        return this._images;
    }

    set images(value) {
        this._images = value;
    }

    get likes() {
        return this._likes;
    }

    set likes(value) {
        this._likes = value;
    }

    get hashtags() {
        return this._hashtags;
    }

    set hashtags(value) {
        this._hashtags = value;
    }

    get comments() {
        return this._comments;
    }

    set comments(value) {
        this._comments = value;
    }
}
