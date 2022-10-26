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

export interface ChangePasswordData {
  email: string;
  oldPassword: string;
  newPassword: string;
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

export interface BuildingType {
  id: number;
  uid: string;
  name: string;
  markdown: string | null;
  markdownURL: string;
  pdfURL: string;
  results: Result[];
  scenarios: JSON;
}

export interface Account {
  id: number;
  name: string;
  email: string;
  apiKey: string;
  results: Result[];
  shareAllResults: boolean | null;
}

export type Signature = Pick<
  Result,
  | "scenario"
>;

export interface Result {
  id: number;
  uid: string;
  deleted: boolean;
  dateRun: Date;
  boptestVersion: string;
  isShared: boolean;

  tags: string[];

  // KPI stuff
  thermalDiscomfort: number;
  energyUse: number;
  cost: number;
  emissions: number;
  iaq: number;
  timeRatio: number;

  // Building Type stuff (formerly testcase stuff)
  timePeriod: string;
  controlStep: string;
  electricityPrice: string;
  weatherForecastUncertainty: string;
  forecastParameters: JSON;
  scenario: JSON;

  account: Account;
  buildingType: BuildingType;
}

// Filter Interfaces
export interface FilterRanges {
  costRange: {
    min: number;
    max: number;
  };
  thermalDiscomfortRange: {
    min: number;
    max: number;
  };
  aqDiscomfortRange: {
    min: number;
    max: number;
  };
  energyRange: {
    min: number;
    max: number;
  };
}

export interface FilterValues {
  scenario: {
    [key: string]: string;
  };
  tags: string[];
  cost: {
    min: number;
    max: number;
  };
  thermalDiscomfort: {
    min: number;
    max: number;
  };
  aqDiscomfort: {
    min: number;
    max: number;
  };
  energy: {
    min: number;
    max: number;
  };
}

export interface BuildingScenarios {
  [key: string]: string[];
}

export interface Scenario {
  [key: string]: string;
}

export interface Scenarios {
  [key: string]: any;
}
