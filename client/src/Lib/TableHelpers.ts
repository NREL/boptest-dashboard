import {
  FilterRanges,
  FilterValues,
  BuildingScenarios,
  Result,
  ResultFacet,
  Scenario,
} from '../../common/interfaces';

export interface Data {
  id: number;
  uid: string;
  isShared: boolean;
  accountUsername: string;
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
  peakElectricity: number;
  peakGas?: number;
  peakDistrictHeating?: number;
  timePeriod: string;
  electricityPrice: string;
  weatherForecastUncertainty: string;
  forecastParameters: Record<string, any>;
  scenario: Record<string, any>;
  tags: string[];
  boptestVersion: string;
  controlStep: string;
}

export const createDataFromResult = (result: Result): Data => {
  return {
    id: result.id,
    uid: result.uid,
    isShared: result.isShared,
    accountUsername: result.account.displayName,
    buildingTypeName: result.buildingType?.name || result.buildingType?.uid || 'Unknown Building',
    dateRun: result.dateRun,
    totalEnergy: result.energyUse,
    thermalDiscomfort: result.thermalDiscomfort,
    aqDiscomfort: result.iaq,
    energy: result.energyUse,
    cost: result.cost,
    timeRatio: result.timeRatio,
    emissions: result.emissions,
    compTimeRatio: result.timeRatio,
    peakElectricity: result.peakElectricity,
    peakGas: result.peakGas,
    peakDistrictHeating: result.peakDistrictHeating,
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
  facets: ResultFacet[]
): BuildingScenarios => {
  const buildingScenarios: BuildingScenarios = {};
  facets.forEach(facet => {
    buildingScenarios[facet.buildingTypeName] = facet.scenario;
  });
  return buildingScenarios;
};

export const getFilterRanges = (rows: Data[]): FilterRanges => {
  if (!rows || rows.length === 0) {
    return {
      costRange: {min: 0, max: 0},
      thermalDiscomfortRange: {min: 0, max: 0},
      aqDiscomfortRange: {min: 0, max: 0},
      energyRange: {min: 0, max: 0},
    };
  }

  const first = rows[0];
  const roundUp = (value: number): number => Math.ceil(value / 50) * 50;

  const initial: FilterRanges = {
    costRange: {min: first.cost, max: roundUp(first.cost)},
    thermalDiscomfortRange: {
      min: first.thermalDiscomfort,
      max: roundUp(first.thermalDiscomfort),
    },
    aqDiscomfortRange: {
      min: first.aqDiscomfort,
      max: roundUp(first.aqDiscomfort),
    },
    energyRange: {min: first.energy, max: roundUp(first.energy)},
  };

  return rows.slice(1).reduce((acc, curr) => {
    const nextMax = (current: number, incoming: number) =>
      roundUp(current > incoming ? current : incoming);

    return {
      costRange: {
        min: Math.min(acc.costRange.min, curr.cost),
        max: nextMax(acc.costRange.max, curr.cost),
      },
      thermalDiscomfortRange: {
        min: Math.min(acc.thermalDiscomfortRange.min, curr.thermalDiscomfort),
        max: nextMax(acc.thermalDiscomfortRange.max, curr.thermalDiscomfort),
      },
      aqDiscomfortRange: {
        min: Math.min(acc.aqDiscomfortRange.min, curr.aqDiscomfort),
        max: nextMax(acc.aqDiscomfortRange.max, curr.aqDiscomfort),
      },
      energyRange: {
        min: Math.min(acc.energyRange.min, curr.energy),
        max: nextMax(acc.energyRange.max, curr.energy),
      },
    };
  }, initial);
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
  if (!rows || rows.length === 0) {
    return rows;
  }

  const {
    cost,
    energy,
    thermalDiscomfort,
    aqDiscomfort,
    scenario: scenarioFilter,
    tags: tagFilter,
  } = filters;

  return rows.filter(row => {
    if (buildingTypeFilter && row.buildingTypeName !== buildingTypeFilter) {
      return false;
    }

    if (
      (cost?.min !== undefined && row.cost < cost.min) ||
      (cost?.max !== undefined && row.cost > cost.max)
    ) {
      return false;
    }

    if (
      (energy?.min !== undefined && row.energy < energy.min) ||
      (energy?.max !== undefined && row.energy > energy.max)
    ) {
      return false;
    }

    if (
      (thermalDiscomfort?.min !== undefined &&
        row.thermalDiscomfort < thermalDiscomfort.min) ||
      (thermalDiscomfort?.max !== undefined &&
        row.thermalDiscomfort > thermalDiscomfort.max)
    ) {
      return false;
    }

    if (
      (aqDiscomfort?.min !== undefined && row.aqDiscomfort < aqDiscomfort.min) ||
      (aqDiscomfort?.max !== undefined && row.aqDiscomfort > aqDiscomfort.max)
    ) {
      return false;
    }

    if (scenarioFilter) {
      for (const key of Object.keys(scenarioFilter)) {
        const value = scenarioFilter[key];
        if (value && row.scenario?.[key] !== value) {
          return false;
        }
      }
    }

    if (tagFilter && tagFilter.length > 0) {
      for (const tag of tagFilter) {
        if (!row.tags.includes(tag)) {
          return false;
        }
      }
    }

    return true;
  });
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
