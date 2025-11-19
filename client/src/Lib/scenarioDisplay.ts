interface ScenarioLabelConfig {
  label: string;
  allLabel?: string;
}

const scenarioLabelMap: Record<string, ScenarioLabelConfig> = {
  timePeriod: {label: 'Time Period', allLabel: 'All Time Periods'},
  electricityPrice: {label: 'Electricity Price', allLabel: 'All Electricity Prices'},
  seed: {label: 'Uncertainty Seed', allLabel: 'All Uncertainty Seeds'},
  temperature_uncertainty: {
    label: 'Temperature Forecast Uncertainty',
    allLabel: 'All Temperature Forecast Levels',
  },
  temperatureUncertainty: {
    label: 'Temperature Forecast Uncertainty',
    allLabel: 'All Temperature Forecast Levels',
  },
  solar_uncertainty: {
    label: 'Solar Forecast Uncertainty',
    allLabel: 'All Solar Forecast Levels',
  },
  solarUncertainty: {
    label: 'Solar Forecast Uncertainty',
    allLabel: 'All Solar Forecast Levels',
  },
  weatherForecastUncertainty: {
    label: 'Weather Forecast Uncertainty',
    allLabel: 'All Weather Forecasts',
  },
};

const humanizeKey = (key: string): string => {
  if (!key) {
    return '';
  }

  const friendly = scenarioLabelMap[key]?.label;
  if (friendly) {
    return friendly;
  }

  const spaced = key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[\-_]+/g, ' ')
    .trim();

  return spaced
    .split(' ')
    .filter(Boolean)
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
};

const formatValue = (value: unknown): string => {
  if (value === undefined || value === null) {
    return '';
  }

  if (Array.isArray(value)) {
    return value
      .map(item => formatValue(item))
      .filter(Boolean)
      .join(', ');
  }

  if (value instanceof Date) {
    return value.toLocaleString();
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};

export interface ScenarioEntry {
  key: string;
  label: string;
  value: string;
}

export const buildScenarioEntries = (
  scenario?: Record<string, unknown> | null
): ScenarioEntry[] => {
  if (!scenario || typeof scenario !== 'object') {
    return [];
  }

  const entries: ScenarioEntry[] = Object.entries(scenario)
    .map(([key, value]) => {
      const formattedValue = formatValue(value);
      return {
        key,
        label: humanizeKey(key),
        value: formattedValue,
      };
    })
    .filter(entry => Boolean(entry.value));

  return entries.sort((a, b) =>
    a.label.localeCompare(b.label, undefined, {sensitivity: 'base'})
  );
};

export const getScenarioLabel = (key: string): string => humanizeKey(key);

export const getScenarioAllLabel = (key: string): string => {
  const config = scenarioLabelMap[key];
  if (config?.allLabel) {
    return config.allLabel;
  }
  const base = humanizeKey(key);
  if (!base) {
    return 'All';
  }
  return `All ${base}${base.endsWith('s') ? '' : 's'}`;
};
