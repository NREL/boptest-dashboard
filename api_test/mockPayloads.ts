import { LoginData, SignupData } from '../common/interfaces';

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
  scenario: {
    timePeriod: 'cooling peak',
    electricityPrice: 'highly dynamic',
    temperature_uncertainty: 'low',
    solar_uncertainty: 'medium',
    seed: 7,
  },
  buildingType: {
    uid: 'buildingType-2',
    name: 'Small Building',
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
  scenario: {
    time: 'cooling peak',
    electricityPrice: 'dynamic',
    temperature_uncertainty: 'none',
    solar_uncertainty: 'high',
    seed: 11,
  },
  buildingType: {
    uid: 'buildingType-2',
    name: 'Small Building',
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
  scenario: {
    timePeriod: 'peak',
    electricityPrice: 'dynamic',
    temperature_uncertainty: 'medium',
    solar_uncertainty: 'low',
    seed: 12,
  },
  buildingType: {
    uid: 'buildingType-2',
    name: 'Small Building',
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
