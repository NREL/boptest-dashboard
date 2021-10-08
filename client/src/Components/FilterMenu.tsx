import React, {useEffect} from 'react';
import clsx from 'clsx';
import {createStyles, makeStyles, withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';
import {FilterRanges, FilterValues, ScenarioOptions} from '../../../common/interfaces';

const useMenuStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-evenly',
    },
  })
);

const ColorButton = withStyles((theme) => ({
  root: {
    color: '#078b75',
    borderColor: '#078b75',
    marginRight: theme.spacing(2),
  }
}))(Button);

const usePopperStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // width: '400px',
      // height: '400px',
    },
    container: {
      padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
    },
    fieldset: {
      border: 'none',
    },
    label: {
      fontWeight: 'bold',
      paddingBottom: theme.spacing(2),
    },
    rangeContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingBottom: theme.spacing(2),
    },
    checkboxContainer: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: '250px',
    },
    selectContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingBottom: theme.spacing(2),
    },
    inputContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    textInput: {
      width: '100%',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: '120px',
    },
    selectInput: {
      minWidth: '260px',
    }
  })
);

interface FilterMenuProps {
  displayFilters: boolean;
  filterRanges: FilterRanges;
  filterValues: FilterValues;
  onRequestFilters: (
    requestedFilters: FilterValues
  ) => void;
  scenarioOptions: ScenarioOptions;
}

export const FilterMenu: React.FC<FilterMenuProps> = props => {
  const menuClasses = useMenuStyles();
  const popperClasses = usePopperStyles();
  const {displayFilters, filterRanges, filterValues, onRequestFilters, scenarioOptions} = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  // const [displayFilters, setDisplayFilters] = React.useState(false);
  const [open, setOpen] = React.useState({
    filter: false,
    cost: false,
    discomfort: false,
    energy: false,
    more: false
  });

  const filters = Object.keys(open);
  const buildingTypes = scenarioOptions && Object.keys(scenarioOptions);

  const handleOpenPopper = (filter) => (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('BuildingTypes:', buildingTypes);
    console.log('scenarioOptions:', scenarioOptions);
    setAnchorEl(event.currentTarget);
    setOpen({ ...open, [filter]: true });
  };

  const handleClosePopper = (filter) => (event: React.MouseEvent<EventTarget>) => {
    setOpen({ ...open, [filter]: false });
  };

  const onFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filterType = event.target.id.split('-');
    const newFilter = {
      ...filterValues,
      [filterType[0]]: {
        ...filterValues[filterType[0]],
        [filterType[1]]: event.target.type === 'checkbox' ? event.target.checked : Number(event.target.value),
      },
    }
    onRequestFilters(newFilter);
  }

  const onSliderFilterChange = (event: any, newValue: number | number[]) => {
    const filterType = event.target.id;
    const newFilter = {
      ...filterValues,
      [filterType]: {
        min: newValue[0],
        max: newValue[1],
      },
    }
    onRequestFilters(newFilter);
  }

  const onSelectFilterChange = (event) => {
    const scenarioType = event.target.name.split('-')[1];
    console.log('scenarioType', scenarioType);
    const newFilter = {
      ...filterValues,
      scenario: {
        ...filterValues.scenario,
        [scenarioType]: event.target.value,
      },
    }
    onRequestFilters(newFilter);
  };

  const isBuildingTypeDisabled = (building) => {
    return filterValues && !filterValues.buildingType[building] && !Object.keys(filterValues.buildingType).every((k) => !filterValues.buildingType[k]);
  }

  const popperContents = (filter) => {
    switch(filter) {
      case 'filter':
        return(
          <form className={clsx(popperClasses.container)}>
            <fieldset className={clsx(popperClasses.fieldset)}>
              <legend className={clsx(popperClasses.label)}>
                Building Type
              </legend>
              {buildingTypes && buildingTypes.map((building) => (
                <div key={building} className={clsx(popperClasses.checkboxContainer)}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id={`buildingType-${building}`}
                        checked={filterValues && filterValues.buildingType[building]}
                        onChange={onFilterChange}
                        name={building}
                        color="primary"
                        disabled={isBuildingTypeDisabled(building)}
                      />
                    }
                    label={building}
                  />
                  {filterValues.buildingType[building] && (
                    <React.Fragment key={`${building}-scenario`}>
                      <legend className={clsx(popperClasses.label)}>
                        Scenario
                      </legend>
                      <div className={clsx(popperClasses.selectContainer)}>
                        <FormControl variant="outlined" className={clsx(popperClasses.formControl)}>
                          <InputLabel id={`${building}-timePeriod`}>Time Period</InputLabel>
                          <Select
                            className={clsx(popperClasses.selectInput)}
                            labelId={`${building}-timePeriod-label`}
                            id={`${building}-timePeriod-select`}
                            value={filterValues && filterValues.scenario && filterValues.scenario.timePeriod}
                            onChange={onSelectFilterChange}
                            name={`${building}-timePeriod`}
                            MenuProps={{
                              disablePortal: true,
                            }}
                          >
                            <MenuItem key={`${building}-none-option`} value="">none</MenuItem>
                            {scenarioOptions[building].timePeriod.map(option => {
                              return (
                                <MenuItem key={`${building}-${option}-option`} value={option}>{option}</MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                        <FormControl variant="outlined" className={clsx(popperClasses.formControl)}>
                          <InputLabel id={`${building}-electricityPriceProfile`}>Electricity Price Profile</InputLabel>
                          <Select
                            className={clsx(popperClasses.selectInput)}
                            labelId={`${building}-electricityPriceProfile-label`}
                            id={`${building}-electricityPriceProfile-select`}
                            value={filterValues && filterValues.scenario && filterValues.scenario.electricityPriceProfile}
                            onChange={onSelectFilterChange}
                            name={`${building}-electricityPriceProfile`}
                            MenuProps={{
                              disablePortal: true,
                            }}
                          >
                            <MenuItem key={`${building}-none-option`} value="">none</MenuItem>
                            {scenarioOptions[building].electricityPriceProfile.map(option => {
                              return (
                                <MenuItem key={`${building}-${option}-option`} value={option}>{option}</MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                        <FormControl variant="outlined" className={clsx(popperClasses.formControl)}>
                          <InputLabel id={`${building}-weatherForecastUncertainty`}>Weather Forecast Uncertainty</InputLabel>
                          <Select
                            className={clsx(popperClasses.selectInput)}
                            labelId={`${building}-weatherForecastUncertainty-label`}
                            id={`${building}-weatherForecastUncertainty-select`}
                            value={filterValues && filterValues.scenario && filterValues.scenario.weatherForecastUncertainty}
                            onChange={onSelectFilterChange}
                            name={`${building}-weatherForecastUncertainty`}
                            MenuProps={{
                              disablePortal: true,
                            }}
                          >
                            <MenuItem key={`${building}-none-option`} value="">none</MenuItem>
                            {scenarioOptions[building].weatherForecastUncertainty.map(option => {
                              return (
                                <MenuItem key={`${building}-${option}-option`} value={option}>{option}</MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              ))}
            </fieldset>
          </form>
        )
      case 'cost':
        const costInputProps = {
          min: 0,
          max: filterRanges && filterRanges.costRange && filterRanges.costRange.max,
        };

        return(
          <form className={clsx(popperClasses.container)}>
            <fieldset className={clsx(popperClasses.fieldset)}>
              <legend className={clsx(popperClasses.label)}>
                Operation Cost Range
              </legend>
              <div className={clsx(popperClasses.rangeContainer)}>
                <div className={clsx(popperClasses.inputContainer)}>
                  <TextField
                    className={clsx(popperClasses.textInput)}
                    id="cost-min"
                    label="Min"
                    type="number"
                    variant="outlined"
                    defaultValue={filterValues && filterValues.cost && filterValues.cost.min}
                    inputProps={costInputProps}
                    onChange={onFilterChange}
                  />
                </div>
                <div>
                  <TextField
                    className={clsx(popperClasses.textInput)}
                    id="cost-max"
                    label="Max"
                    type="number"
                    variant="outlined"
                    defaultValue={filterValues && filterValues.cost && filterValues.cost.max}
                    inputProps={costInputProps}
                    onChange={onFilterChange}
                  />
                </div>
              </div>
              <Slider
                id="cost"
                value={[filterValues && filterValues.cost && filterValues.cost.min, filterValues && filterValues.cost && filterValues.cost.max]}
                onChange={onSliderFilterChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                // getAriaValueText={valuetext}
              />
            </fieldset>
          </form>
        )
      case 'discomfort':
        const thermalDiscomfortInputProps = {
          min: 0,
          max: filterRanges && filterRanges.thermalDiscomfortRange && filterRanges.thermalDiscomfortRange.max,
        };

        const aqDiscomfortInputProps = {
          min: 0,
          max: filterRanges && filterRanges.aqDiscomfortRange && filterRanges.aqDiscomfortRange.max,
        };

        return(
          <form className={clsx(popperClasses.container)}>
            <fieldset className={clsx(popperClasses.fieldset)}>
              <legend className={clsx(popperClasses.label)}>
                Thermal Discomfort Range
              </legend>
              <div className={clsx(popperClasses.rangeContainer)}>
                <div className={clsx(popperClasses.inputContainer)}>
                  <TextField
                    className={clsx(popperClasses.textInput)}
                    id="thermalDiscomfort-min"
                    label="Min"
                    type="number"
                    variant="outlined"
                    defaultValue={filterValues && filterValues.thermalDiscomfort && filterValues.thermalDiscomfort.min}
                    inputProps={thermalDiscomfortInputProps}
                    onChange={onFilterChange}
                  />
                </div>
                <div>
                  <TextField
                    className={clsx(popperClasses.textInput)}
                    id="thermalDiscomfort-max"
                    label="Max"
                    type="number"
                    variant="outlined"
                    defaultValue={filterValues && filterValues.thermalDiscomfort && filterValues.thermalDiscomfort.max}
                    inputProps={thermalDiscomfortInputProps}
                    onChange={onFilterChange}
                  />
                </div>
              </div>
            </fieldset>
            <fieldset className={clsx(popperClasses.fieldset)}>
              <legend className={clsx(popperClasses.label)}>
                Air Quality Discomfort Range
              </legend>
              <div className={clsx(popperClasses.rangeContainer)}>
                <div className={clsx(popperClasses.inputContainer)}>
                  <TextField
                    className={clsx(popperClasses.textInput)}
                    id="aqDiscomfort-min"
                    label="Min"
                    type="number"
                    variant="outlined"
                    defaultValue={filterValues && filterValues.aqDiscomfort && filterValues.aqDiscomfort.min}
                    inputProps={aqDiscomfortInputProps}
                    onChange={onFilterChange}
                  />
                </div>
                <div>
                  <TextField
                    className={clsx(popperClasses.textInput)}
                    id="aqDiscomfort-max"
                    label="Max"
                    type="number"
                    variant="outlined"
                    defaultValue={filterValues && filterValues.aqDiscomfort && filterValues.aqDiscomfort.max}
                    inputProps={aqDiscomfortInputProps}
                    onChange={onFilterChange}
                  />
                </div>
              </div>
            </fieldset>
          </form>
        )
      case 'energy':
        const energyInputProps = {
          min: 0,
          max: filterRanges && filterRanges.energyRange && filterRanges.energyRange.max,
        };

        return(
          <form className={clsx(popperClasses.container)}>
            <fieldset className={clsx(popperClasses.fieldset)}>
              <legend className={clsx(popperClasses.label)}>
                Energy Usage Range
              </legend>
              <div className={clsx(popperClasses.rangeContainer)}>
                <div className={clsx(popperClasses.inputContainer)}>
                  <TextField
                    className={clsx(popperClasses.textInput)}
                    id="energy-min"
                    label="Min"
                    type="number"
                    variant="outlined"
                    defaultValue={filterValues && filterValues.energy && filterValues.energy.min}
                    inputProps={energyInputProps}
                    onChange={onFilterChange}
                  />
                </div>
                <div>
                  <TextField
                    className={clsx(popperClasses.textInput)}
                    id="energy-max"
                    label="Max"
                    type="number"
                    variant="outlined"
                    defaultValue={filterValues && filterValues.energy && filterValues.energy.max}
                    inputProps={energyInputProps}
                    onChange={onFilterChange}
                  />
                </div>
              </div>
            </fieldset>
          </form>
        )
      default:
        return(
          <form className={clsx(popperClasses.container)}>
            <fieldset className={clsx(popperClasses.fieldset)}>
              <legend className={clsx(popperClasses.label)}>
                More
              </legend>
            </fieldset>
          </form>
        )
    }
  };

  return (
    <div className={clsx(menuClasses.buttonContainer)}>
      {filters.map((filter) => {
        return displayFilters || filter === 'filter' ? (
          <React.Fragment key={filter}>
            <ColorButton variant="outlined" onClick={handleOpenPopper(filter)}>{filter}</ColorButton>
            <Popper
              open={open[filter]}
              anchorEl={anchorEl}
              placement={'bottom-start'}
            >
              <ClickAwayListener onClickAway={handleClosePopper(filter)}>
                <Paper className={clsx(popperClasses.root)} elevation={3}>
                  {popperContents(filter)}
                </Paper>
              </ClickAwayListener>
            </Popper>
          </React.Fragment>
        ) : null}
      )}
    </div>
  );
}