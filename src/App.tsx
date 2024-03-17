import React, { useState } from 'react';
import { Card, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpenseTable from './Component/Table';
import TopBar from './Component/TopBar';

// @TODO: add light/dark theme switch

const baseTheme = createTheme({
  typography: {
    fontFamily: [
      '"Helvetica Neue"',
      '"Helvetica Neue"',
      '"Helvetica Neue"',
      '"Helvetica Neue"',
    ].join(','),
  },
  palette: {
    background: {
      default: '#f4f4f4', // Customize the default background color
      paper: '#ffffff', // Customize the background color of paper-based components
    },
    primary: {
      main: '#000000', // Customize the primary color
    },
    secondary: {
      main: '#fafafa',
    },
    error: {
      main: '#ff6b6b',
    },
    warning: {
      main: '#ffa726', // Your warning color
      contrastText: '#ffffff', // Text color that contrasts with the warning color
    },
    info: {
      main: '#14a37f',
    },
    success: {
      main: '#2e7d32',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
      disabled: '#aaaaaa',
      // You can add a custom field for warning text like this
    },
  },
})

// Create light and dark themes
const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    mode: 'light',
    // additional light theme customization
  },
});

const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    mode: 'dark',
    // additional dark theme customization
  },
});

// Styled components using the `styled` function
const Layout = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  backgroundColor: theme.palette.grey[200], // slightly darker for the sidebar
}));

const LeftBar = styled('div')(({ theme }) => ({
  width: '200px',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[200], // slightly darker for the sidebar
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: 'calc(100% - ' + theme.spacing(4) + ')', // adjust height based on padding
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  boxShadow: 'none', // remove shadow
  backgroundColor: theme.palette.grey[200], // slightly darker for the sidebar
}));

const MainContent = styled('div')({
  flex: 1,
  padding: '16px',
});

const App = () => {
  const [mode, setMode] = useState('light'); // State for theme mode

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Select theme based on state
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize baseline styles across browsers */}
      <Layout>
        <LeftBar>
          <StyledCard>
            {/* Card content goes here */}
          </StyledCard>
        </LeftBar>
        <MainContent>
          <TopBar theme={theme} toggleTheme={toggleTheme} />
          <ExpenseTable theme={theme} toggleTheme={toggleTheme} />
        </MainContent>
      </Layout>
    </ThemeProvider>
  );
};

export default App;
