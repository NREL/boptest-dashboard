export interface Data {
  id: number;
  uid: string;
  accountUsername: string;
  accountEmail: string;
  buildingTypeName: string;
  dateRun: Date;
  totalEnergy: number;
  thermalDiscomfort: number;
  aqDiscomfort: number; //indoor air quality discomfort
  energy: number; //total energy consumption
  cost: number; //total operations cost
  timeRatio: number;
  emissions: number;
  compTimeRatio: number;
  controllerProperties: JSON;
  testTimePeriod: string;
  controlStep: string;
  priceScenario: string;
  weatherForecastUncertainty: string;
}

export const createDataFromResult = (result): Data => {
  return {
    id: result.id,
    uid: result.uid,
    accountUsername: result.account.name,
    accountEmail: result.account.email,
    buildingTypeName: result.buildingType.name,
    dateRun: result.dateRun,
    totalEnergy: result.energyUse,
    thermalDiscomfort: result.thermalDiscomfort,
    aqDiscomfort: result.iaq,
    energy: result.energyUse,
    cost: result.cost,
    timeRatio: result.timeRatio,
    emissions: result.emissions,
    compTimeRatio: result.timeRatio,
    controllerProperties: result.controllerProperties,
    testTimePeriod: result.testTimePeriod,
    controlStep: result.controlStep,
    priceScenario: result.priceScenario,
    weatherForecastUncertainty: result.weatherForecastUncertainty,
  };
};

export const createRows = (results): Data[] => {
  let rows: Data[] = [];
  if (!results || !Array.isArray(results) || results.length == 0) {
    return rows;
  }
  results.forEach(result => {
    rows.push(createDataFromResult(result));
  });
  return rows;
};

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export type Order = 'asc' | 'desc';

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: {[key in Key]: number | string},
  b: {[key in Key]: number | string}
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}