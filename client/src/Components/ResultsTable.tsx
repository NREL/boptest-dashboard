import React, {useEffect, useMemo, useState} from 'react';
import axios from 'axios';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
  useTheme,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import {FilterMenu} from './FilterMenu';
import {useUser} from '../Context/user-context';
import {
  FilterRanges,
  FilterValues,
  ResultFacet,
  BuildingScenarios,
} from '../../common/interfaces';
import {
  createRows,
  createTagOptions,
  Data,
  filterRows,
  getBuildingScenarios,
  getComparator,
  getFilterRanges,
  HeadCell,
  Order,
  setupFilters,
  stableSort,
} from '../Lib/TableHelpers';

const baseHeadCells: HeadCell[] = [
  {
    id: 'buildingTypeName',
    numeric: false,
    disablePadding: false,
    label: 'Building Type',
  },
  {id: 'dateRun', numeric: false, disablePadding: false, label: 'Date Run'},
  {
    id: 'totalEnergy',
    numeric: true,
    disablePadding: false,
    label: 'Total Energy [kWh/m^2]',
  },
  {
    id: 'thermalDiscomfort',
    numeric: true,
    disablePadding: false,
    label: 'Thermal Discomfort [Kh/zone]',
  },
  {
    id: 'aqDiscomfort',
    numeric: true,
    disablePadding: false,
    label: 'Indoor Air Quality Discomfort [ppmh/zone]',
  },
  {
    id: 'cost',
    numeric: true,
    disablePadding: false,
    label: 'Total Operations Cost [$ or Euro/m^2]',
  },
  {
    id: 'emissions',
    numeric: true,
    disablePadding: false,
    label: 'Total CO2 emissions [kgCO2/m^2]',
  },
  {
    id: 'peakElectricity',
    numeric: true,
    disablePadding: false,
    label: 'Peak Electrical Demand [kW/m2]',
  },
  {
    id: 'peakGas',
    numeric: true,
    disablePadding: false,
    label: 'Peak Gas Demand [kW/m2]',
  },
  {
    id: 'peakDistrictHeating',
    numeric: true,
    disablePadding: false,
    label: 'Peak District Heating Demand [kW/m2]',
  },
  {
    id: 'compTimeRatio',
    numeric: true,
    disablePadding: false,
    label: 'Computational Time Ratio [-]',
  },
];

function buildHeadCells(includeShareColumn: boolean): HeadCell[] {
  if (!includeShareColumn) {
    return baseHeadCells;
  }
  return [
    ...baseHeadCells,
    {
      id: 'isShared',
      numeric: false,
      disablePadding: false,
      label: 'Shared',
    },
  ];
}

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  enableSelection: boolean;
  includeShareColumn: boolean;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: keyof Data;
  rowCount: number;
}

const parseHeaderLabel = (label: string): {main: string; unit: string | null} => {
  const matches = label.match(/^(.*?)\s*(\[.*?\])?$/);
  if (matches && matches[2]) {
    return {
      main: matches[1].trim(),
      unit: matches[2].trim(),
    };
  }
  return {main: label, unit: null};
};

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    classes,
    enableSelection,
    includeShareColumn,
    numSelected,
    onSelectAllClick,
    onRequestSort,
    order,
    orderBy,
    rowCount,
  } = props;
  const theme = useTheme();
  const headCells = buildHeadCells(includeShareColumn);

  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  const allSelected = rowCount > 0 && numSelected === rowCount;

  return (
    <TableHead style={{borderSpacing: '0 !important'}}>
      <TableRow style={{borderCollapse: 'collapse'}}>
        {enableSelection && (
          <TableCell padding="checkbox">
            <Checkbox
              checked={allSelected}
              indeterminate={numSelected > 0 && numSelected < rowCount}
              onChange={onSelectAllClick}
              inputProps={{'aria-label': 'select all results'}}
              color="primary"
            />
          </TableCell>
        )}
        {headCells.map(headCell => {
          const {main, unit} = parseHeaderLabel(headCell.label);

          return (
            <TableCell
              key={headCell.id}
              align={'center'}
              padding={'none'}
              sortDirection={orderBy === headCell.id ? order : false}
              className={`${classes.headerCell} ${classes.stickyHeader}`}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                <div>
                  <span className={classes.headerLabel}>{main}</span>
                  {unit && <span className={classes.headerUnit}>{unit}</span>}
                </div>
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(1.5, 3, 1, 3),
      borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
      backgroundColor: 'rgba(0, 0, 0, 0.02)',
      minHeight: '56px',
      flexWrap: 'wrap',
      gap: theme.spacing(1),
    },
    filterContainer: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: theme.spacing(1),
      flex: 1,
      minWidth: 0,
    },
    select: {
      margin: theme.spacing(0, 2, 0, 0),
      width: '320px',
      maxWidth: '100%',
    },
    selectIcon: {
      fill: theme.palette.primary.main,
    },
    toggleContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      minWidth: '220px',
      gap: theme.spacing(1),
      flexWrap: 'wrap',
    },
    downloadButton: {
      whiteSpace: 'nowrap',
    },
    summary: {
      color: theme.palette.text.secondary,
    },
  })
);

const ColorButton = withStyles(theme => ({
  root: {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    margin: theme.spacing(0, 0, 0, 1.5),
    height: '40px',
  },
}))(Button);

const ColorSelect = withStyles(theme => ({
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
    '& .MuiSelect-icon': {
      right: '12px',
      position: 'absolute',
    },
    '& .MuiSelect-select': {
      paddingRight: '60px !important',
    },
  },
}))(TextField);

interface EnhancedTableToolbarProps {
  buildingTypeFilterOptions: {[index: number]: string};
  displayClear: boolean;
  buildingFilterValue: string;
  totalResults: number;
  numSelected: number;
  updateBuildingFilter: (value: string) => void;
  enableSelection?: boolean;
  showDownloadButton?: boolean;
  onDownloadSelected?: () => void;
  downloadDisabled?: boolean;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const {
    buildingTypeFilterOptions,
    displayClear,
    buildingFilterValue,
    totalResults,
    numSelected,
    updateBuildingFilter,
    enableSelection = false,
    showDownloadButton = false,
    onDownloadSelected,
    downloadDisabled = false,
  } = props;

  const selectProps = {
    classes: {icon: classes.selectIcon},
    MenuProps: {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
      },
      getContentAnchorEl: null,
    },
    displayEmpty: true,
  };

  const handleSelectChange = (
    event: React.ChangeEvent<{name?: string; value: unknown}>
  ) => {
    const value = event.target.value as string;
    updateBuildingFilter(value === 'all' ? '' : value);
  };

  const summaryText = enableSelection && numSelected > 0
    ? `${numSelected.toLocaleString()} selected`
    : `${totalResults.toLocaleString()} total results`;

  return (
    <Toolbar className={classes.root}>
      <div className={classes.filterContainer}>
        <ColorSelect
          className={classes.select}
          label=""
          placeholder="Building Type"
          name="buildingType-filter"
          onChange={handleSelectChange}
          select
          value={buildingFilterValue || 'all'}
          defaultValue="all"
          variant="outlined"
          SelectProps={{
            ...selectProps,
            renderValue: value =>
              value && value !== 'all' ? (value as string) : 'All Building Types',
          }}
          size="small"
          InputProps={{
            style: {
              height: '40px',
            },
          }}
        >
          <MenuItem value="all">All Building Types</MenuItem>
          {buildingTypeFilterOptions.map(option => {
            if (option === 'All Building Types') {
              return null;
            }
            return (
              <MenuItem key={`${option}-option`} value={option}>
                {option}
              </MenuItem>
            );
          })}
        </ColorSelect>
        {displayClear && (
          <ColorButton variant="outlined" onClick={() => updateBuildingFilter('')}>
            Clear
          </ColorButton>
        )}
      </div>

      <div className={classes.toggleContainer}>
        <Typography variant="body2" className={classes.summary}>
          {summaryText}
        </Typography>
        {showDownloadButton && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => onDownloadSelected?.()}
            disabled={downloadDisabled}
            className={classes.downloadButton}
          >
            Download Selected (CSV)
          </Button>
        )}
      </div>
    </Toolbar>
  );
};

const useFilterToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      justifyContent: 'space-between',
      padding: theme.spacing(1, 3, 0, 3),
      marginTop: theme.spacing(1),
      flexWrap: 'wrap',
      gap: theme.spacing(1),
    },
  })
);

interface FilterToolbarProps {
  scenarioOptions?: Record<string, string[]>;
  tagOptions: string[];
  filterRanges: FilterRanges;
  filterValues: FilterValues;
  updateFilters: (requestedFilters: FilterValues) => void;
}

const FilterToolbar = (props: FilterToolbarProps) => {
  const classes = useFilterToolbarStyles();
  const {
    filterRanges,
    filterValues,
    scenarioOptions,
    tagOptions,
    updateFilters,
  } = props;

  const onRequestUpdateFilters = (requestedFilters: FilterValues) => {
    updateFilters(requestedFilters);
  };

  return (
    <Toolbar className={classes.root}>
      <FilterMenu
        filterRanges={filterRanges}
        filterValues={filterValues}
        onRequestFilters={onRequestUpdateFilters}
        scenarioOptions={scenarioOptions}
        tagOptions={tagOptions}
      />
    </Toolbar>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      minHeight: 0,
    },
    paper: {
      width: '100%',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      minHeight: 0,
    },
    headerCell: {
      fontWeight: 600,
      padding: theme.spacing(1.5),
      minWidth: '100px',
      maxWidth: '180px',
      border: 'none',
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
    },
    headerLabel: {
      display: 'block',
      fontWeight: 600,
      fontSize: '0.875rem',
      lineHeight: 1.2,
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    headerUnit: {
      display: 'block',
      fontSize: '0.75rem',
      fontWeight: 400,
      color: 'rgba(0, 0, 0, 0.6)',
      marginTop: theme.spacing(0.5),
      whiteSpace: 'nowrap',
    },
    table: {
      minWidth: 750,
      '& .MuiTableCell-root': {
        borderLeft: 'none',
        borderRight: 'none',
      },
    },
    tableContainer: {
      flex: 1,
      height: '100%',
      overflow: 'auto',
      maxHeight: 'none',
      minHeight: 0,
    },
    stickyHeader: {
      position: 'sticky',
      top: 0,
      backgroundColor: '#fff',
      zIndex: 10,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRight: 'none',
      '&::after': {
        content: '""',
        position: 'absolute',
        left: 0,
        right: 0,
        height: '1px',
        bottom: 0,
        backgroundColor: 'rgba(224, 224, 224, 1)',
      },
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
    footer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(3),
      borderTop: '1px solid rgba(0, 0, 0, 0.08)',
      marginTop: 'auto',
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      fontWeight: 500,
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    tableRow: {
      '&$selected, &$selected:hover': {
        backgroundColor: theme.palette.primary.light,
      },
    },
    selected: {},
  })
);

interface ResultsTableProps {
  results: any[];
  buildingFacets: ResultFacet[];
  setSelectedResult: (result: any) => void;
  enableSelection?: boolean;
  enableShareToggle?: boolean;
  onShareToggleComplete?: () => void;
  showDownloadButton?: boolean;
}

export default function ResultsTable(props: ResultsTableProps) {
  const {
    results,
    buildingFacets = [],
    setSelectedResult,
    enableSelection = false,
    enableShareToggle = false,
    onShareToggleComplete,
    showDownloadButton = false,
  } = props;

  const {csrfToken} = useUser();
  const sessionHeaders = useMemo(
    () => (csrfToken ? {'X-CSRF-Token': csrfToken} : {}),
    [csrfToken]
  );

  const classes = useStyles();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>('dateRun');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [rows, setRows] = useState<Data[]>([]);
  const [filteredRows, setFilteredRows] = useState<Data[]>([]);
  const [buildingScenarios, setBuildingScenarios] = useState<BuildingScenarios>({});
  const [filterRanges, setFilterRanges] = useState<FilterRanges | any>({});
  const [displayFilters, setDisplayFilters] = useState(false);
  const [buildingTypeFilter, setBuildingTypeFilter] = useState<string>('');
  const [filters, setFilters] = useState<FilterValues | any>({});
  const [tagOptions, setTagOptions] = useState<string[]>([]);

  useEffect(() => {
    const allRows = createRows(results);
    setRows(allRows);
    setFilteredRows(allRows);
    setBuildingScenarios(getBuildingScenarios(buildingFacets));
    setSelectedIds([]);
  }, [results, buildingFacets]);

  useEffect(() => {
    setFilterRanges(getFilterRanges(rows));
  }, [rows]);

  useEffect(() => {
    setFilters(setupFilters(filterRanges as FilterRanges, []));
  }, [filterRanges]);

  useEffect(() => {
    if (buildingTypeFilter === '') {
      setDisplayFilters(false);
      setFilters(setupFilters(filterRanges as FilterRanges, []));
    } else {
      setDisplayFilters(true);
      const scenarioKeys = Object.keys(buildingScenarios[buildingTypeFilter] || {});
      setFilters(setupFilters(filterRanges as FilterRanges, scenarioKeys));
    }
  }, [buildingTypeFilter, buildingScenarios, filterRanges]);

  useEffect(() => {
    setFilteredRows(filterRows(rows, buildingTypeFilter, filters as FilterValues));
  }, [filters, rows, buildingTypeFilter]);

  useEffect(() => {
    setTagOptions(createTagOptions(filteredRows));
  }, [filteredRows]);

  const handleUpdateFilters = (requestedFilters: FilterValues) => {
    setFilters(requestedFilters);
  };

  const handleUpdateBuildingFilter = (requestedBuilding: string) => {
    setBuildingTypeFilter(requestedBuilding);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!enableSelection) {
      return;
    }
    if (event.target.checked) {
      const newSelecteds = filteredRows.map(row => row.id);
      setSelectedIds(newSelecteds);
      return;
    }
    setSelectedIds([]);
  };

  const handleCheckboxClick = (
    event: React.MouseEvent<unknown>,
    id: number
  ) => {
    event.stopPropagation();
    if (!enableSelection) {
      return;
    }

    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(existing => existing !== id);
      }
      return [...prev, id];
    });
  };

  const isSelected = (id: number) => selectedIds.indexOf(id) !== -1;

  const handleRowClick = (
    event: React.MouseEvent<unknown>,
    result: Data
  ) => {
    event.preventDefault();
    setSelectedResult(result);
  };

  const handleShareToggleClick = (
    event: React.MouseEvent<unknown>,
    result: Data
  ) => {
    event.stopPropagation();
    if (!enableShareToggle) {
      return;
    }

    axios
      .patch(
        '/api/results/share',
        {id: result.id, share: !result.isShared},
        {
          headers: sessionHeaders,
          withCredentials: true,
        }
      )
      .then(() => {
        onShareToggleComplete?.();
      })
      .catch(error => {
        console.error('Unable to update sharing preference', error);
      });
  };

  const selectedRows = useMemo(
    () => rows.filter(row => selectedIds.includes(row.id)),
    [rows, selectedIds]
  );

  const downloadResultsToCSV = () => {
    if (!enableSelection || selectedRows.length === 0) {
      return;
    }

    const headers = [
      'Result UID',
      'Building Type',
      'Date Run',
      'Total Energy',
      'Thermal Discomfort',
      'IAQ Discomfort',
      'Cost',
      'Emissions',
      'Peak Electricity',
      'Peak Gas',
      'Peak District Heating',
      'Computational Time Ratio',
      'Shared',
    ];

    const csvRows = selectedRows.map(row => [
      row.uid,
      row.buildingTypeName,
      new Date(row.dateRun).toISOString(),
      row.totalEnergy,
      row.thermalDiscomfort,
      row.aqDiscomfort,
      row.cost,
      row.emissions,
      row.peakElectricity,
      row.peakGas ?? '',
      row.peakDistrictHeating ?? '',
      row.compTimeRatio,
      row.isShared ? 'Yes' : 'No',
    ]);

    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const tableRows = stableSort(filteredRows, getComparator(order, orderBy));
  const includeShareColumn = enableShareToggle;
  const displayClear = buildingTypeFilter !== '';

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          buildingTypeFilterOptions={
            buildingScenarios && Object.keys(buildingScenarios)
          }
          displayClear={displayClear}
          buildingFilterValue={buildingTypeFilter}
          totalResults={filteredRows.length}
          numSelected={selectedIds.length}
          updateBuildingFilter={handleUpdateBuildingFilter}
          enableSelection={enableSelection}
          showDownloadButton={enableSelection && showDownloadButton}
          onDownloadSelected={downloadResultsToCSV}
          downloadDisabled={selectedIds.length === 0}
        />
        {displayFilters && (
          <FilterToolbar
            scenarioOptions={
              buildingTypeFilter
                ? (buildingScenarios[buildingTypeFilter] as Record<string, string[]>)
                : undefined
            }
            tagOptions={tagOptions}
            filterRanges={filterRanges as FilterRanges}
            filterValues={filters as FilterValues}
            updateFilters={handleUpdateFilters}
          />
        )}
        <TableContainer className={classes.tableContainer}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
            stickyHeader
            style={{borderCollapse: 'collapse'}}
            classes={{
              root: classes.table,
            }}
          >
            <EnhancedTableHead
              classes={classes}
              enableSelection={enableSelection}
              includeShareColumn={includeShareColumn}
              numSelected={selectedIds.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
              order={order}
              orderBy={orderBy}
              rowCount={filteredRows.length}
            />
            <TableBody>
              {tableRows.map((row, index) => {
                const isItemSelected = enableSelection ? isSelected(row.id) : false;
                const labelId = `enhanced-table-checkbox-${index}`;
                const dateString = new Date(row.dateRun).toLocaleString();

                return (
                  <TableRow
                    hover
                    onClick={event => handleRowClick(event, row)}
                    role="checkbox"
                    aria-checked={enableSelection ? isItemSelected : undefined}
                    tabIndex={-1}
                    key={row.uid}
                    selected={enableSelection && isItemSelected}
                    classes={{selected: classes.selected}}
                    className={classes.tableRow}
                  >
                    {enableSelection && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{'aria-labelledby': labelId}}
                          color="primary"
                          onClick={event => handleCheckboxClick(event, row.id)}
                        />
                      </TableCell>
                    )}
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="normal"
                      style={{maxWidth: '180px'}}
                    >
                      <Typography
                        variant="body1"
                        noWrap
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'block',
                        }}
                        title={row.buildingTypeName}
                      >
                        {row.buildingTypeName}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        noWrap
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'block',
                        }}
                        title={dateString}
                      >
                        {dateString}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1">
                        {row.totalEnergy.toFixed(4)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1">
                        {row.thermalDiscomfort.toFixed(4)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1">
                        {row.aqDiscomfort.toFixed(4)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1">
                        {row.cost.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1">
                        {row.emissions.toFixed(4)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1">
                        {row.peakElectricity.toFixed(4)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1">
                        {row.peakGas !== null ? row.peakGas.toFixed(4) : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1">
                        {row.peakDistrictHeating !== null
                          ? row.peakDistrictHeating.toFixed(4)
                          : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1">
                        {row.compTimeRatio.toFixed(4)}
                      </Typography>
                    </TableCell>
                    {includeShareColumn && (
                      <TableCell align="center">
                        <Switch
                          checked={row.isShared}
                          onClick={event => handleShareToggleClick(event, row)}
                          name="share switch"
                          inputProps={{'aria-label': 'toggle shared'}}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <div className={classes.footer}>
          <Typography variant="body2">
            These results are generated using BOPTEST. Please visit the{' '}
            <a
              href="https://ibpsa.github.io/project1-boptest/"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.link}
            >
              BOPTEST Homepage
            </a>{' '}
            to learn more.
          </Typography>
        </div>
      </Paper>
    </div>
  );
}
