import {createTheme} from '@material-ui/core/styles';

// Create a theme matching the BOPTEST website
const theme = createTheme({
  palette: {
    primary: {
      main: '#188eac', // BOPTEST primary teal/blue
      light: '#4bb2cc',
      dark: '#0d6c85',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#485fc7', // BOPTEST link color
      light: '#6b80d9',
      dark: '#324099',
      contrastText: '#ffffff',
    },
    success: {
      main: '#48c78e', // BOPTEST success color
    },
    error: {
      main: '#f14668', // BOPTEST danger color
    },
    warning: {
      main: '#ffe08a', // BOPTEST warning color
    },
    background: {
      default: '#ffffff', // White background like BOPTEST site
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
    fontSize: 16,
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      lineHeight: 1.5,
    },
    body2: {
      lineHeight: 1.5,
    },
  },
  overrides: {
    // Override for sticky header tables
    MuiTableContainer: {
      root: {
        '& .MuiTable-stickyHeader .MuiTableCell-stickyHeader': {
          borderLeft: 'none',
          borderRight: 'none',
        }
      }
    },
    MuiButton: {
      root: {
        textTransform: 'none',
        borderRadius: 4,
        fontWeight: 500,
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
    },
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: '#188eac', // Match BOPTEST primary color
      },
      root: {
        boxShadow: 'none',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: 0,
      },
      elevation1: {
        boxShadow: 'none',
        border: '1px solid rgba(0, 0, 0, 0.08)',
      },
    },
    MuiTableCell: {
      head: {
        fontWeight: 600,
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        borderBottom: '2px solid rgba(0, 0, 0, 0.1)',
        borderLeft: 'none',
        borderRight: 'none',
      },
      root: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        borderLeft: 'none',
        borderRight: 'none',
      },
    },
    MuiTableSortLabel: {
      root: {
        '&:hover': {
          color: '#188eac',
        },
        '&.MuiTableSortLabel-active': {
          color: '#188eac',
        }
      },
      icon: {
        opacity: 0.5,
        '&.MuiTableSortLabel-iconActive': {
          color: '#188eac',
          opacity: 1,
        }
      }
    },
    MuiTableRow: {
      root: {
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
        },
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
      },
    },
  },
});

export default theme;
