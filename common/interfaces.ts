// TODO add shared interfaces between client and server here
export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  username: string;
  token: string;
}
