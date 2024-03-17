import { AppBar, Typography, IconButton, Toolbar } from '@mui/material';
import Brightness5Icon from '@mui/icons-material/Brightness5';

export default function TopBar({ theme, toggleTheme }: any) {
    return (
        <AppBar position="static" elevation={0} sx={{
            backgroundColor: theme.palette.grey[200], // slightly darker for the sidebar
        }}>
            <Toolbar>
                <Typography variant="h4" style={{
                    flexGrow: 1, textAlign: 'left',
                    color: theme.palette.primary.main,
                    display: 'inline-block', // Added for inline display
                    verticalAlign: 'middle', // Align text vertically
                    lineHeight: '64px',
                }}>
                    Expense Splitter
                </Typography>
                <IconButton edge="end" color="inherit" aria-label="theme switch" style={{
                    display: 'flex',
                    verticalAlign: 'middle', // Align icon vertically
                    color: theme.palette.primary.main,
                }}
                >
                    <Brightness5Icon />
                </IconButton>
            </Toolbar>
        </AppBar >
    );
}