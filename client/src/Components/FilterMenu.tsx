import React from 'react';
import {createStyles, makeStyles, withStyles} from '@material-ui/core/styles';
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
      height: '50px',
      width: '100%',
    },
    selectContainer: {
      display: 'flex',
      justifyContent: 'space-evenly',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-evenly',
    },
    select: {
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(2),
      width: '275px',
      textTransform: 'capitalize',
    },
    selectIcon: {
      fill: '#078b75',
    },
  })
);

const ColorButton = withStyles(theme => ({
  root: {
    color: '#078b75',
    borderColor: '#078b75',
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
}))(Button);

const ColorTextField = withStyles({
  root: {
    '& label': {
      color: '#078b75',
    },
    '& label.Mui-focused': {
      color: '#078b75',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#078b75',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#078b75',
      },
      '&:hover fieldset': {
        borderColor: '#078b75',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#078b75',
      },
    },
  },
})(TextField);

const usePopperStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      minWidth: '250px',
    },
    label: {
      alignSelf: 'center',
      fontWeight: 'bold',
      paddingBottom: theme.spacing(2),
    },
    rangeContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignSelf: 'center',
      width: '100%',
      paddingBottom: theme.spacing(2),
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
    },
  })
);

interface FilterMenuProps {
  filterRanges: FilterRanges;
  filterValues: FilterValues;
  onRequestFilters: (requestedFilters: FilterValues) => void;
  scenarioOptions: string[];
  tagOptions: string[];
}

export const FilterMenu: React.FC<FilterMenuProps> = props => {
  const menuClasses = useMenuStyles();
  const popperClasses = usePopperStyles();
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
                          style={{color: '#078b75'}}
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
      },
    };

    return (
      <div className={menuClasses.selectContainer}>
        {scenarioKeys.map(key => {
          return (
            <React.Fragment key={key}>
              <ColorTextField
                className={menuClasses.select}
                label={key.split(/(?=[A-Z])/).join(' ')}
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
                variant="outlined"
                SelectProps={selectProps}
                size="small"
              >
                <MenuItem key="buildingType-none-option" value="">
                  none
                </MenuItem>
                {scenarioOptions[key].map(option => {
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
