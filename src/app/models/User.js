export class User
{
    constructor(id, identifiant, password, nom, prenom, avatar)
    {
        this._id = id;
        this._identifiant = identifiant;
        this._password = password;
        this._nom = nom;
        this._prenom = prenom;
        this._avatar = avatar;
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

    get password()
    {
        return this._password;
    }

    set pass(value)
    {
        this._password = value;
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
}
