export class User
{
    constructor(id, identifiant, pass, nom, prenom, avatar, status, birthday)
    {
        this._id = id;
        this._identifiant = identifiant;
        this._pass = pass;
        this._nom = nom;
        this._prenom = prenom;
        this._avatar = avatar;
        this._status = status;
        this._birthday = birthday;
    }

    get id()
    {
        return this._id;
    }

    set id(value)
    {
        this._id = value;
    }

    get identifiant()
    {
        return this._identifiant;
    }

    set identifiant(value)
    {
        this._identifiant = value;
    }

    get pass()
    {
        return this._pass;
    }

    set pass(value)
    {
        this._pass = value;
    }

    get nom()
    {
        return this._nom;
    }

    set nom(value)
    {
        this._nom = value;
    }

    get prenom()
    {
        return this._prenom;
    }

    set prenom(value)
    {
        this._prenom = value;
    }

    get avatar()
    {
        return this._avatar;
    }

    set avatar(value)
    {
        this._avatar = value;
    }

    get status()
    {
        return this._status;
    }

    set status(value)
    {
        this._status = value;
    }

    get birthday()
    {
        return this._birthday;
    }

    set birthday(value)
    {
        this._birthday = value;
    }
}
