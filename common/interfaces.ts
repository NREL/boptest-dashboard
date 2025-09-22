// Removed SignupData, ChangePasswordData, and LoginData interfaces
// as we're using OAuth-only authentication

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
  peakElectricity: {
    min: number;
    max: number;
  };
  peakGas: {
    min: number;
    max: number;
  };
  peakDistrictHeating: {
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
  scenarios: Record<string, any>;
}

export interface Account {
  id: number;
  hashedIdentifier: string;  // Replaces sub/email/name with privacy-friendly identifier
  displayName: string;       // Display name instead of real name
  apiKey: string;            // Maintained for API access
  apiKeySalt: string;
  results: Result[];
  shareAllResults: boolean | null;
  oauthProvider: string;     // "google" or "github" only
}

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
  peakElectricity: number;
  peakGas?: number;
  peakDistrictHeating?: number;

  // Building Type stuff (formerly testcase stuff)
  timePeriod: string;
  controlStep: string;
  electricityPrice: string;
  weatherForecastUncertainty: string;
  forecastParameters: Record<string, any>;
  scenario: Record<string, any>;

  account: Account;
  buildingType: BuildingType;
}

export interface ResultFacet {
  buildingTypeUid: string;
  buildingTypeName: string;
  scenario: {
    [key: string]: string[];
  };
  tags: string[];
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
  [key: string]: {
    [scenarioKey: string]: string[];
  };
}

export interface Scenario {
  [key: string]: string;
}

export interface Scenarios {
  [key: string]: any;
}
