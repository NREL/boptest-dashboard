import {
  FilterRanges,
  FilterValues,
  BuildingScenarios,
  BuildingType,
  Result,
  Scenario,
} from '../../common/interfaces';

export interface Data {
  id: number;
  uid: string;
  isShared: boolean;
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
  timePeriod: string;
  electricityPrice: string;
  weatherForecastUncertainty: string;
  forecastParameters: JSON;
  scenario: JSON;
  tags: string[];
  boptestVersion: string;
  controlStep: string;
}

export const createDataFromResult = (result: Result): Data => {
  return {
    id: result.id,
    uid: result.uid,
    isShared: result.isShared,
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
    timePeriod: result.timePeriod,
    electricityPrice: result.electricityPrice,
    weatherForecastUncertainty: result.weatherForecastUncertainty,
    forecastParameters: result.forecastParameters,
    scenario: result.scenario,
    tags: result.tags,
    boptestVersion: result.boptestVersion,
    controlStep: result.controlStep,
  };
};

export const createRows = (results: Result[]): Data[] => {
  const rows: Data[] = [];
  if (!results || !Array.isArray(results) || results.length === 0) {
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

export const getBuildingScenarios = (
  buildingTypes: BuildingType[]
): BuildingScenarios => {
  const buildingScenarios: any = {};
  buildingTypes.forEach((building: BuildingType) => {
    buildingScenarios[building.name] = building.scenarios;
  });
  return buildingScenarios;
};

export const getFilterRanges = (rows: Data[]): FilterRanges => {
  return rows.reduce(
    (acc, curr) => {
      return {
        costRange: {
          min: acc.costRange.min < curr.cost ? acc.costRange.min : curr.cost,
          max:
            Math.ceil(
              (acc.costRange.max > curr.cost ? acc.costRange.max : curr.cost) /
                50
            ) * 50,
        },
        thermalDiscomfortRange: {
          min:
            acc.thermalDiscomfortRange.min < curr.thermalDiscomfort
              ? acc.thermalDiscomfortRange.min
              : curr.thermalDiscomfort,
          max:
            Math.ceil(
              (acc.thermalDiscomfortRange.max > curr.thermalDiscomfort
                ? acc.thermalDiscomfortRange.max
                : curr.thermalDiscomfort) / 50
            ) * 50,
        },
        aqDiscomfortRange: {
          min:
            acc.aqDiscomfortRange.min < curr.aqDiscomfort
              ? acc.aqDiscomfortRange.min
              : curr.aqDiscomfort,
          max:
            Math.ceil(
              (acc.aqDiscomfortRange.max > curr.aqDiscomfort
                ? acc.aqDiscomfortRange.max
                : curr.aqDiscomfort) / 50
            ) * 50,
        },
        energyRange: {
          min:
            acc.energyRange.min < curr.energy
              ? acc.energyRange.min
              : curr.energy,
          max:
            Math.ceil(
              (acc.energyRange.max > curr.energy
                ? acc.energyRange.max
                : curr.energy) / 50
            ) * 50,
        },
      };
    },
    {
      costRange: {min: 0, max: 0},
      thermalDiscomfortRange: {min: 0, max: 0},
      aqDiscomfortRange: {min: 0, max: 0},
      energyRange: {min: 0, max: 0},
    }
  );
};

export const setupFilters = (
  filterRanges: FilterRanges,
  scenarioKeys: string[]
): FilterValues => {
  const scenarioFilters: any = {};
  scenarioKeys.forEach(key => {
    scenarioFilters[key] = '';
  });

  return {
    scenario: {...scenarioFilters},
    tags: [],
    cost: {
      min: 0,
      max:
        filterRanges && filterRanges.costRange ? filterRanges.costRange.max : 0,
    },
    thermalDiscomfort: {
      min: 0,
      max:
        filterRanges && filterRanges.thermalDiscomfortRange
          ? filterRanges.thermalDiscomfortRange.max
          : 0,
    },
    aqDiscomfort: {
      min: 0,
      max:
        filterRanges && filterRanges.aqDiscomfortRange
          ? filterRanges.aqDiscomfortRange.max
          : 0,
    },
    energy: {
      min: 0,
      max:
        filterRanges && filterRanges.energyRange
          ? filterRanges.energyRange.max
          : 0,
    },
  };
};

export const filterRows = (
  rows: Data[],
  buildingTypeFilter: string,
  filters: FilterValues
): Data[] => {
  const filteredRows: Data[] = [];
  const scenarioFilter: Scenario = filters.scenario;
  const tagFilter: string[] = filters.tags;
  if (rows.length <= 0 || buildingTypeFilter === '') {
    return rows;
  }
  rows.forEach((row: any) => {
    if (
      row.buildingTypeName !== buildingTypeFilter ||
      row.cost < filters.cost.min ||
      row.cost > filters.cost.max ||
      row.energy < filters.energy.min ||
      row.energy > filters.energy.max ||
      row.thermalDiscomfort < filters.thermalDiscomfort.min ||
      row.thermalDiscomfort > filters.thermalDiscomfort.max ||
      row.aqDiscomfort < filters.aqDiscomfort.min ||
      row.aqDiscomfort > filters.aqDiscomfort.max
    ) {
      return;
    }
    for (const key in scenarioFilter) {
      if (
        scenarioFilter[key] !== '' &&
        row.scenario[key] !== scenarioFilter[key]
      ) {
        return;
      }
    }
    for (const tag in tagFilter) {
      if (!row.tags.includes(tagFilter[tag])) {
        return;
      }
    }
    filteredRows.push(row);
  });
  return filteredRows;
};

export const createTagOptions = (rows: Data[]): string[] => {
  const tagOptions: string[] = [];
  rows.forEach((row: any) => {
    row.tags.forEach((tag: any) => {
      if (!tagOptions.includes(tag)) {
        tagOptions.push(tag);
      }
    });
  });
  return tagOptions.sort();
};
