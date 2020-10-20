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

export interface SignatureDetails {
  numResults: number;
  thermalDiscomfort: {
    min: number;
    max: number;
  };
  energyUse: {
    min: number;
    max: number;
  };
  cost: {
    min: number;
    max: number;
  };
  emissions: {
    min: number;
    max: number;
  };
  iaq: {
    min: number;
    max: number;
  };
  timeRatio: {
    min: number;
    max: number;
  };
}
