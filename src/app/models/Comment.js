export class Comment {
    constructor(text, commentedBy, date, hour) {
        this._text = text;
        this._commentedBy = commentedBy;
        this._date = date;
        this._hour = hour;
    }

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
    }

    get commentedBy() {
        return this._commentedBy;
    }

    set commentedBy(value) {
        this._commentedBy = value;
    }

    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }

    get hour() {
        return this._hour;
    }

    set hour(value) {
        this._hour = value;
    }
}
