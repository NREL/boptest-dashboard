import React from 'react';
import {createStyles, makeStyles, withStyles, useTheme, Theme} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import TextField from '@material-ui/core/TextField';
import {FilterRanges, FilterValues} from '../../common/interfaces';

const useMenuStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      minHeight: '56px', /* Match toolbar height */
      width: '100%',
      flexWrap: 'wrap',
      padding: theme.spacing(0),
      alignItems: 'center', /* Center items vertically */
    },
    selectContainer: {
      display: 'flex',
      justifyContent: 'flex-start',
      flexWrap: 'wrap',
      flex: '1 1 auto',
      marginRight: theme.spacing(2),
      gap: theme.spacing(2), /* Match spacing with Building Type row */
      alignItems: 'center', /* Center items vertically */
      height: '56px', /* Fixed height */
      [theme.breakpoints.down('sm')]: {
        width: '100%'
      },
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      flexWrap: 'nowrap', /* Prevent wrapping */
      flex: '0 0 auto',
      alignItems: 'center', /* Align with other elements */
    },
    select: {
      margin: theme.spacing(0, 2, 0, 0), /* Match margin with Building Type row */
      width: '320px', /* Slightly smaller to fit with wider gaps */
      maxWidth: '100%',
      textTransform: 'capitalize',
      '& .MuiInputLabel-outlined': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: 'calc(100% - 60px)' /* Give more space for arrow */
      },
      '& .MuiSelect-select': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'flex',
        alignItems: 'center',
        paddingRight: '60px' /* Increased space for the dropdown arrow */
      },
      /* Use standard Material-UI padding */
    },
    selectIcon: {
      fill: theme.palette.primary.main,
      right: '12px', // Match Building Type dropdown
    },
  })
);

const ColorButton = withStyles(theme => ({
  root: {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    margin: theme.spacing(2, 0, 1, 2),
    height: '40px',
    alignSelf: 'flex-start',
  },
}))(Button);

const ColorTextField = withStyles(theme => ({
  root: {
    '& label': {
      color: theme.palette.primary.main,
    },
    '& label.Mui-focused': {
      color: theme.palette.primary.main,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiInputLabel-outlined': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: 'calc(100% - 60px)' /* Match Building Type dropdown */
    },
    /* Remove custom icon positioning to use standard Material-UI dropdown arrow */
  },
}))(TextField);

const usePopperStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: theme.spacing(2),
      minWidth: '250px',
      maxWidth: '400px',
    },
    label: {
      alignSelf: 'center',
      fontWeight: 'bold',
      paddingBottom: theme.spacing(2),
      textAlign: 'center',
    },
    rangeContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'center',
      width: '100%',
      paddingBottom: theme.spacing(2),
      gap: theme.spacing(2),
      flexWrap: 'wrap',
    },
    tagsMsgContainer: {
      paddingBottom: theme.spacing(2),
    },
    tagsContainer: {
      display: 'flex',
      justifyContent: 'space-evenly',
      flexWrap: 'wrap',
      maxWidth: '500px',
      paddingBottom: theme.spacing(2),
    },
    textInput: {
      minWidth: '100px',
      flex: '1 1 auto',
    },
  })
);

interface FilterMenuProps {
  filterRanges: FilterRanges;
  filterValues: FilterValues;
  onRequestFilters: (requestedFilters: FilterValues) => void;
  scenarioOptions?: Record<string, string[]>;
  tagOptions: string[];
}

export const FilterMenu: React.FC<FilterMenuProps> = props => {
  const menuClasses = useMenuStyles();
  const popperClasses = usePopperStyles();
  const theme = useTheme();
  const {
    filterRanges,
    filterValues,
    onRequestFilters,
    scenarioOptions,
    tagOptions,
  } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [open, setOpen] = React.useState({
    cost: false,
    discomfort: false,
    energy: false,
    tags: false,
  });

  const filters = Object.keys(open);
  const scenarioKeys = scenarioOptions ? Object.keys(scenarioOptions) : [];

  // EVENTS

  const handleOpenPopper =
    filter => (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      setOpen({...open, [filter]: true});
    };

  const handleClosePopper = filter => () => {
    setOpen({...open, [filter]: false});
  };

  const onFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filterType = event.target.id.split('-');
    const newFilter = {
      ...filterValues,
      [filterType[0]]: {
        ...filterValues[filterType[0]],
        [filterType[1]]: Number(event.target.value),
      },
    };
    onRequestFilters(newFilter);
  };

  const onScenarioFilterChange = event => {
    const newFilter = {
      ...filterValues,
      scenario: {
        ...filterValues.scenario,
        [event.target.name]: event.target.value,
      },
    };
    onRequestFilters(newFilter);
  };

  const onTagFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = {
      ...filterValues,
    };
    event.target.checked
      ? newFilter.tags.push(event.target.name)
      : (newFilter.tags = newFilter.tags.filter(
          tag => tag !== event.target.name
        ));
    onRequestFilters(newFilter);
  };

  // RENDERS

  const renderPopperContents = filter => {
    switch (filter) {
      case 'cost': {
        const costInputProps = {
          min: 0,
          max:
            filterRanges &&
            filterRanges.costRange &&
            filterRanges.costRange.max,
        };

        return (
          <div className={popperClasses.container}>
            <legend className={popperClasses.label}>
              Operation Cost Range
            </legend>
            <div className={popperClasses.rangeContainer}>
              <ColorTextField
                className={popperClasses.textInput}
                id="cost-min"
                label="Min"
                type="number"
                variant="outlined"
                defaultValue={
                  filterValues && filterValues.cost && filterValues.cost.min
                }
                inputProps={costInputProps}
                onChange={onFilterChange}
              />
              <ColorTextField
                className={popperClasses.textInput}
                id="cost-max"
                label="Max"
                type="number"
                variant="outlined"
                defaultValue={
                  filterValues && filterValues.cost && filterValues.cost.max
                }
                inputProps={costInputProps}
                onChange={onFilterChange}
              />
            </div>
          </div>
        );
      }
      case 'discomfort': {
        const thermalDiscomfortInputProps = {
          min: 0,
          max:
            filterRanges &&
            filterRanges.thermalDiscomfortRange &&
            filterRanges.thermalDiscomfortRange.max,
        };

        const aqDiscomfortInputProps = {
          min: 0,
          max:
            filterRanges &&
            filterRanges.aqDiscomfortRange &&
            filterRanges.aqDiscomfortRange.max,
        };

        return (
          <div className={popperClasses.container}>
            <legend className={popperClasses.label}>
              Thermal Discomfort Range
            </legend>
            <div className={popperClasses.rangeContainer}>
              <ColorTextField
                className={popperClasses.textInput}
                id="thermalDiscomfort-min"
                label="Min"
                type="number"
                variant="outlined"
                defaultValue={
                  filterValues &&
                  filterValues.thermalDiscomfort &&
                  filterValues.thermalDiscomfort.min
                }
                inputProps={thermalDiscomfortInputProps}
                onChange={onFilterChange}
              />
              <ColorTextField
                className={popperClasses.textInput}
                id="thermalDiscomfort-max"
                label="Max"
                type="number"
                variant="outlined"
                defaultValue={
                  filterValues &&
                  filterValues.thermalDiscomfort &&
                  filterValues.thermalDiscomfort.max
                }
                inputProps={thermalDiscomfortInputProps}
                onChange={onFilterChange}
              />
            </div>
            <legend className={popperClasses.label}>
              Air Quality Discomfort Range
            </legend>
            <div className={popperClasses.rangeContainer}>
              <ColorTextField
                className={popperClasses.textInput}
                id="aqDiscomfort-min"
                label="Min"
                type="number"
                variant="outlined"
                defaultValue={
                  filterValues &&
                  filterValues.aqDiscomfort &&
                  filterValues.aqDiscomfort.min
                }
                inputProps={aqDiscomfortInputProps}
                onChange={onFilterChange}
              />
              <ColorTextField
                className={popperClasses.textInput}
                id="aqDiscomfort-max"
                label="Max"
                type="number"
                variant="outlined"
                defaultValue={
                  filterValues &&
                  filterValues.aqDiscomfort &&
                  filterValues.aqDiscomfort.max
                }
                inputProps={aqDiscomfortInputProps}
                onChange={onFilterChange}
              />
            </div>
          </div>
        );
      }
      case 'energy': {
        const energyInputProps = {
          min: 0,
          max:
            filterRanges &&
            filterRanges.energyRange &&
            filterRanges.energyRange.max,
        };

        return (
          <div className={popperClasses.container}>
            <legend className={popperClasses.label}>Energy Usage Range</legend>
            <div className={popperClasses.rangeContainer}>
              <ColorTextField
                className={popperClasses.textInput}
                id="energy-min"
                label="Min"
                type="number"
                variant="outlined"
                defaultValue={
                  filterValues && filterValues.energy && filterValues.energy.min
                }
                inputProps={energyInputProps}
                onChange={onFilterChange}
              />
              <ColorTextField
                className={popperClasses.textInput}
                id="energy-max"
                label="Max"
                type="number"
                variant="outlined"
                defaultValue={
                  filterValues && filterValues.energy && filterValues.energy.max
                }
                inputProps={energyInputProps}
                onChange={onFilterChange}
              />
            </div>
          </div>
        );
      }
      default:
        return (
          <div className={popperClasses.container}>
            <legend className={popperClasses.label}>Tags</legend>
            {tagOptions && tagOptions.length <= 0 ? (
              <div className={popperClasses.tagsMsgContainer}>
                The current filtered results do not have any tags associated
                with them.
              </div>
            ) : (
              <div className={popperClasses.tagsContainer}>
                {tagOptions &&
                  tagOptions.map(tag => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          id={`tags-${tag}`}
                          checked={
                            filterValues && filterValues.tags.includes(tag)
                          }
                          onChange={onTagFilterChange}
                          name={tag}
                          color="primary"
                        />
                      }
                      label={tag}
                      key={tag}
                    />
                  ))}
              </div>
            )}
          </div>
        );
    }
  };

  const renderFilterButtons = () => {
    return (
      <div className={menuClasses.buttonContainer}>
        {filters.map(filter => {
          return (
            <React.Fragment key={filter}>
              <ColorButton
                variant="outlined"
                onClick={handleOpenPopper(filter)}
              >
                {filter}
              </ColorButton>
              <Popper
                open={open[filter]}
                anchorEl={anchorEl}
                placement={'bottom'}
              >
                <ClickAwayListener onClickAway={handleClosePopper(filter)}>
                  <Paper elevation={3}>{renderPopperContents(filter)}</Paper>
                </ClickAwayListener>
              </Popper>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const renderScenarioFilters = () => {
    const selectProps = {
      classes: {icon: menuClasses.selectIcon},
      MenuProps: {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        getContentAnchorEl: null,
        PaperProps: {
          style: { 
            maxWidth: '400px' 
          }
        }
      }
    };

    return (
      <div className={menuClasses.selectContainer}>
        {scenarioKeys.map(key => {
          return (
            <React.Fragment key={key}>
              <ColorTextField
                className={menuClasses.select}
                label={key === 'weatherForecastUncertainty' ? 'Weather Forecast' : key.split(/(?=[A-Z])/).join(' ')}
                name={key}
                onChange={onScenarioFilterChange}
                select
                value={
                  filterValues &&
                  filterValues.scenario &&
                  filterValues.scenario[key]
                    ? filterValues.scenario[key]
                    : ''
                }
                defaultValue="" /* Always show "All" option by default */
                variant="outlined"
                SelectProps={{
                  ...selectProps,
                  displayEmpty: true,
                  renderValue: (value) => {
                    if (!value || value === '') {
                      if (key === 'weatherForecastUncertainty') return 'All Weather Forecasts';
                      return `All ${key.split(/(?=[A-Z])/).join(' ')}s`;
                    }
                    return value;
                  }
                }}
                size="small"
                InputProps={{
                  style: { 
                    whiteSpace: 'normal', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    display: 'flex',
                    alignItems: 'center',
                    height: '40px' /* Match height with Building Type */
                  }
                }}
                InputLabelProps={{
                  style: { 
                    whiteSpace: 'nowrap',
                    display: 'block',
                    width: '100%',
                    transform: 'translate(14px, -6px) scale(0.75)' /* Match label positioning with Building Type */
                  },
                  shrink: true /* Keep label shrunk like Building Type */
                }}
              >
                <MenuItem key="buildingType-none-option" value="">
                  {key === 'weatherForecastUncertainty' ? 'All Weather Forecasts' : `All ${key.split(/(?=[A-Z])/).join(' ')}s`}
                </MenuItem>
                {(scenarioOptions?.[key] || []).map(option => {
                  return (
                    <MenuItem
                      key={`${option}-option`}
                      size="small"
                      value={option}
                    >
                      {option}
                    </MenuItem>
                  );
                })}
              </ColorTextField>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className={menuClasses.menuContainer}>
      {renderScenarioFilters()}
      {renderFilterButtons()}
    </div>
  );
};
