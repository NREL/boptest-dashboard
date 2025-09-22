import { LoginData, SignupData, BuildingType, Result } from '../common/interfaces';

export const suSignup: SignupData = {
  username: 'user1',
  email: 'email1@email.com',
  password: 'pass'
};

export const suLogin: LoginData = {
  email: 'email1@email.com',
  password: `doesn't matter.`
};

export const nonSuSignup: SignupData = {
  username: 'user2',
  email: 'a@email.com',
  password: 'pass'
};

export const nonSuLogin: LoginData = {
  email: 'a@email.com',
  password: `doesn't matter.`
};

export const nnonexistentUserLogin: LoginData = {
  email: 'doesNot@exist.com',
  password: `doesn't matter.`
}

type BuildingTypePayload = Omit<BuildingType, 'id' | 'markdown' | 'results'>;
type BuildingTypeUpdatePayload = Omit<BuildingType, 'id' | 'uid' | 'markdown' | 'results'>;

const scenario1 = {
  "timePeriod": ["cooling peak", "heating peak", "heating typical"],
  "electricityPrice": ["constant", "dynamic", "highly dynamic"],
  "weatherForecastUncertainty": ["deterministic"]
};

const scenario2 = {
  "timePeriod": ["cooling peak", "heating typical"],
  "electricityPrice": ["dynamic", "highly dynamic"],
  "weatherForecastUncertainty": ["deterministic"]
};

const scenario3 = {
  "timePeriod": ["cooling peak", "heating typical", "freezing peak"],
  "electricityPrice": ["dynamic", "highly dynamic"],
  "weatherForecastUncertainty": ["deterministic"],
  "airQuality": ["smoky"]
};

export const mockBuilding1: BuildingTypePayload = {
  uid: 'one',
  name: 'this is a building',
  pdfURL: 'https://www.ikea.com/us/en/assembly_instructions/kallax-shelving-unit__AA-1009445-5_pub.pdf',
  markdownURL: 'https://raw.githubusercontent.com/danmar/cppcheck/main/readme.md',
  scenarios: scenario1
};

export const mockBuilding2: BuildingTypePayload = {
  uid: 'two',
  name: 'this is a building',
  pdfURL: 'https://www.ikea.com/us/en/assembly_instructions/kallax-shelving-unit__AA-1009445-5_pub.pdf',
  markdownURL: 'https://raw.githubusercontent.com/danmar/cppcheck/main/readme.md',
  scenarios: scenario2
};

export const mockBuilding3: BuildingTypePayload = {
  uid: 'three',
  name: 'this is a building',
  pdfURL: 'https://www.ikea.com/us/en/assembly_instructions/kallax-shelving-unit__AA-1009445-5_pub.pdf',
  markdownURL: 'https://raw.githubusercontent.com/danmar/cppcheck/main/readme.md',
  scenarios: scenario2
};

export const mockBuilding4: BuildingTypeUpdatePayload = {
  name: 'this is a building that got updated',
  pdfURL: 'https://www.ikea.com/us/en/assembly_instructions/kallax-shelving-unit__AA-1009445-5_pub.pdf',
  markdownURL: 'https://raw.githubusercontent.com/danmar/cppcheck/main/readme.md',
  scenarios: scenario3
};

const baseValidResult = {
  dateRun: '2020-08-04T23:00:00.000Z',
  boptestVersion: '0.1.0',
  isShared: true,
  controlStep: '360.0',
  account: {},
  tags: ['tag1', 'tag2', 'tag3'],
  kpis: {
    cost_tot: 21,
    emis_tot: 17,
    ener_tot: 29,
    idis_tot: 444,
    tdis_tot: 79,
    time_rat: 1460,
    pele_tot: 10.0,
    pgas_tot: 5.0,
    pdih_tot: 0.0
  },
  forecastParameters: {
    horizon: 21600.0,
    interval: 3600.0
  },
  scenario: {
    timePeriod: 'cooling peak',
    electricityPrice: 'highly dynamic',
    weatherForecastUncertainty: 'deterministic',
  },
  buildingType: {
    uid: 'two',
  },
}

export const mockResult1 = {
  ...baseValidResult,
  uid: 'result1',
};

export const mockResult2 = {
  ...baseValidResult,
  uid: 'result2',
};

export const mockResult3 = {
  ...baseValidResult,
  uid: 'result3',
};

export const mockResult4 = {
  uid: 'result4',
  dateRun: '2020-08-04T23:00:00.000Z',
  boptestVersion: '0.1.0',
  isShared: true,
  controlStep: '360.0',
  account: {},
  tags: ['tag1', 'tag2', 'tag3'],
  kpis: {
    cost_tot: 21,
    emis_tot: 17,
    ener_tot: 29,
    idis_tot: 444,
    tdis_tot: 79,
    time_rat: 1460,
    pele_tot: 10.0,
    pgas_tot: 5.0,
    pdih_tot: 0.0
  },
  forecastParameters: {
    horizon: 21600.0,
    interval: 3600.0
  },
  scenario: {
    time: 'cooling peak',
    electricityPrice: 'dynamic',
    weatherForecastUncertainty: 'deterministic',
  },
  buildingType: {
    uid: 'two',
  },
};

export const mockResult5 = {
  uid: 'result5',
  dateRun: '2020-08-04T23:00:00.000Z',
  boptestVersion: '0.1.0',
  isShared: true,
  controlStep: '360.0',
  account: {},
  tags: ['tag1', 'tag2', 'tag3'],
  kpis: {
    cost_tot: 21,
    emis_tot: 17,
    ener_tot: 29,
    idis_tot: 444,
    tdis_tot: 79,
    time_rat: 1460,
    pele_tot: 10.0,
    pgas_tot: 5.0,
    pdih_tot: 0.0
  },
  forecastParameters: {
    horizon: 21600.0,
    interval: 3600.0
  },
  scenario: {
    timePeriod: 'peak',
    electricityPrice: 'dynamic',
    weatherForecastUncertainty: 'deterministic',
  },
  buildingType: {
    uid: 'two',
  },
};

export const mockResult6 = {
  ...baseValidResult,
  uid: 'result6',
};

export const mockResult7 = {
  ...baseValidResult,
  uid: 'result7',
};

export const mockResult8 = {
  ...baseValidResult,
  uid: 'result8',
};

export const mockResult9 = {
  ...baseValidResult,
  uid: 'result9',
};

export const mockResult10 = {
  ...baseValidResult,
  uid: 'result10',
};

export const mockResult11 = {
  ...baseValidResult,
  uid: 'result11',
};

export const mockResult12 = {
  ...baseValidResult,
  uid: 'result12',
};

export const mockResult13 = {
  ...baseValidResult,
  uid: 'result13',
};

export const mockResult14 = {
  ...baseValidResult,
  uid: 'result14',
};
