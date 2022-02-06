import React from 'react';
import { ThemeProvider} from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { Box, IconButton, AppBar, Toolbar } from '@mui/material';
import stargateLogo from '../../img/stargate.png';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { grey } from '@mui/material/colors';
import ThemeColour from '../../pages/ThemeColour';
import { makeStyles } from '@mui/styles';
import AdminDrawer from './AdminDrawer';

/**
 * Header for admin pages
 * 
 * @returns AdminHeader
 */
function AdminHeader() {

    // Load page themes
    const theme = ThemeColour();
    const useStyles = makeStyles({
        customizeAppBar: {
            minHeight: 100
        },
    });
    const classes = useStyles();

    // Return header with admin drawer navigation, home navigation and logo, and sign out
    return(
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <ThemeProvider theme={theme} >
                    <AppBar color='darkblue' position='static' className={classes.customizeAppBar}>
                        <Toolbar style={{display: "flex", justifyContent: "space-between", alignContent: 'center', minHeight:100}}>
                            <div style={{display: 'flex'}}>
                                <AdminDrawer />
                            </div>
                            <div style={{display: 'flex'}}>
                                <Link to='/'>
                                    <img src={stargateLogo} alt="StarGate" style={{pointerEvents:"all", width:"min(150px, 15wh)", height: "min(75px, 7.5vh)"}}/>
                                </Link>
                            </div>
                            <div style={{display: 'flex'}}>
                                <Link to={'/'}>
                                    <IconButton onClick={() => {localStorage.removeItem('token'); localStorage.removeItem('customerid')}}>
                                        <ExitToAppIcon sx={{ color: grey[50]}} fontSize='large'/>
                                    </IconButton>
                                </Link>
                            </div>
                        </Toolbar>
                    </AppBar>
                </ThemeProvider>
            </Box>
        </div>
    )
}

export default AdminHeader;