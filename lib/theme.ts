import { createTheme, ThemeOptions } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// Agriculture-inspired color palette
const colors = {
  primary: {
    50: '#e8f5e8',
    100: '#c8e6c8',
    200: '#a5d6a5',
    300: '#81c784',
    400: '#66bb6a',
    500: '#4caf50', // Main green
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
  },
  secondary: {
    50: '#fff3e0',
    100: '#ffe0b2',
    200: '#ffcc80',
    300: '#ffb74d',
    400: '#ffa726',
    500: '#ff9800', // Harvest orange
    600: '#f57c00',
    700: '#ef6c00',
    800: '#e65100',
    900: '#bf360c',
  },
  success: {
    50: '#e7f3e7',
    100: '#c1e1c1',
    200: '#98ce98',
    300: '#6fbb6f',
    400: '#51ad51',
    500: '#339e33', // Growth green
    600: '#2d8f2d',
    700: '#247d24',
    800: '#1c6b1c',
    900: '#0f4c0f',
  },
  warning: {
    50: '#fff8e1',
    100: '#ffecb3',
    200: '#ffe082',
    300: '#ffd54f',
    400: '#ffca28',
    500: '#ffc107', // Grain yellow
    600: '#ffb300',
    700: '#ffa000',
    800: '#ff8f00',
    900: '#ff6f00',
  },
  error: {
    50: '#ffebee',
    100: '#ffcdd2',
    200: '#ef9a9a',
    300: '#e57373',
    400: '#ef5350',
    500: '#f44336', // Alert red
    600: '#e53935',
    700: '#d32f2f',
    800: '#c62828',
    900: '#b71c1c',
  },
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  brown: {
    50: '#efebe9',
    100: '#d7ccc8',
    200: '#bcaaa4',
    300: '#a1887f',
    400: '#8d6e63',
    500: '#795548', // Soil brown
    600: '#6d4c41',
    700: '#5d4037',
    800: '#4e342e',
    900: '#3e2723',
  }
};

// Create custom theme
const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary[500],
      light: colors.primary[300],
      dark: colors.primary[700],
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.secondary[500],
      light: colors.secondary[300],
      dark: colors.secondary[700],
      contrastText: '#ffffff',
    },
    success: {
      main: colors.success[500],
      light: colors.success[300],
      dark: colors.success[700],
      contrastText: '#ffffff',
    },
    warning: {
      main: colors.warning[500],
      light: colors.warning[300],
      dark: colors.warning[700],
      contrastText: '#000000',
    },
    error: {
      main: colors.error[500],
      light: colors.error[300],
      dark: colors.error[700],
      contrastText: '#ffffff',
    },
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
    },
    text: {
      primary: colors.grey[900],
      secondary: colors.grey[700],
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      color: colors.primary[800],
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
      color: colors.primary[800],
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      color: colors.primary[700],
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      color: colors.primary[700],
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      color: colors.primary[600],
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.4,
      color: colors.primary[600],
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: colors.grey[600],
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease-in-out',
          },
        },
        contained: {
          background: `linear-gradient(45deg, ${colors.primary[500]} 30%, ${colors.primary[400]} 90%)`,
          '&:hover': {
            background: `linear-gradient(45deg, ${colors.primary[600]} 30%, ${colors.primary[500]} 90%)`,
          },
        },
        outlined: {
          borderColor: colors.primary[500],
          color: colors.primary[500],
          '&:hover': {
            borderColor: colors.primary[600],
            backgroundColor: alpha(colors.primary[500], 0.04),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          paddingBottom: 8,
        },
        title: {
          fontWeight: 600,
          color: colors.primary[800],
        },
        subheader: {
          color: colors.grey[600],
          marginTop: 4,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        filled: {
          '&.MuiChip-colorPrimary': {
            backgroundColor: colors.primary[500],
            color: '#ffffff',
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: colors.secondary[500],
            color: '#ffffff',
          },
          '&.MuiChip-colorSuccess': {
            backgroundColor: colors.success[500],
            color: '#ffffff',
          },
          '&.MuiChip-colorWarning': {
            backgroundColor: colors.warning[500],
            color: colors.grey[900],
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: colors.primary[800],
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(0, 0, 0, 0.05)',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
        elevation3: {
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          padding: '16px',
        },
        head: {
          backgroundColor: alpha(colors.primary[500], 0.05),
          fontWeight: 600,
          color: colors.primary[800],
          borderBottom: '2px solid rgba(76, 175, 80, 0.1)',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha(colors.primary[500], 0.02),
          },
          '&:nth-of-type(odd)': {
            backgroundColor: alpha(colors.primary[500], 0.01),
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '& fieldset': {
              borderColor: colors.grey[300],
            },
            '&:hover fieldset': {
              borderColor: colors.primary[400],
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary[500],
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          padding: 8,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '1.5rem',
          color: colors.primary[800],
          paddingBottom: 8,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8,
          backgroundColor: alpha(colors.primary[500], 0.1),
        },
        bar: {
          borderRadius: 4,
          background: `linear-gradient(45deg, ${colors.primary[500]} 30%, ${colors.success[500]} 90%)`,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.primary[500],
          fontWeight: 600,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
        },
        standardSuccess: {
          backgroundColor: alpha(colors.success[500], 0.1),
          color: colors.success[800],
          border: `1px solid ${alpha(colors.success[500], 0.2)}`,
        },
        standardWarning: {
          backgroundColor: alpha(colors.warning[500], 0.1),
          color: colors.warning[800],
          border: `1px solid ${alpha(colors.warning[500], 0.2)}`,
        },
        standardError: {
          backgroundColor: alpha(colors.error[500], 0.1),
          color: colors.error[800],
          border: `1px solid ${alpha(colors.error[500], 0.2)}`,
        },
        standardInfo: {
          backgroundColor: alpha(colors.primary[500], 0.1),
          color: colors.primary[800],
          border: `1px solid ${alpha(colors.primary[500], 0.2)}`,
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: colors.error[500],
          color: '#ffffff',
          fontWeight: 600,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: colors.primary[500],
            '&:hover': {
              backgroundColor: alpha(colors.primary[500], 0.08),
            },
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: colors.primary[500],
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: colors.primary[500],
          '&.Mui-checked': {
            color: colors.primary[600],
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: colors.primary[500],
          '&.Mui-checked': {
            color: colors.primary[600],
          },
        },
      },
    },
  },
};

// Create and export the theme
const theme = createTheme(themeOptions);

export default theme;
