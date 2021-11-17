import { LoginData, SignupData, BuildingType } from '../common/interfaces';

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

const scenario1: JSON = <JSON><unknown> {
  "timePeriod": ["cooling peak", "heating peak", "heating typical"],
  "electricityPrice": ["constant", "dynamic", "highly dynamic"],
  "weatherForecastUncertainty": ["deterministic"]
};

const scenario2: JSON = <JSON><unknown> {
  "timePeriod": ["cooling peak", "heating typical"],
  "electricityPrice": ["dynamic", "highly dynamic"],
  "weatherForecastUncertainty": ["deterministic"]
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

