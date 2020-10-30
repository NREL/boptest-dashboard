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

export interface ConfirmNewPasswordData {
  username: string;
  verificationCode: string;
  newPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface LoginData {
  email: string;
  password: string;
}
