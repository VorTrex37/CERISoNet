export interface AuthResponse {
  data: {
    _id: number;
    _identifiant: string;
    _password: string;
    _nom: string;
    _prenom: string;
    _avatar: string;
  };
  token: string;
}
