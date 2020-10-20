// TODO add shared interfaces between client and server here
export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface ConfirmData {
  username: string;
  verificationCode: string;
}

export interface LoginData {
  email: string;
  password: string;
}
