import React from 'react';
import {Box, AppBar, Toolbar, IconButton, Typography} from '@material-ui/core';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AdminDrawer from './AdminDrawer';
import {useHistory} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';

function AdminToolbar({title}) {

    const history = useHistory();

    const useStyles = makeStyles({
        customizeAppBar: {
            minHeight: 36
        },
        customizeToolbar: {
            minHeight: 36
        }
    });
    const classes = useStyles();

    function logout() {
        localStorage.removeItem('token');
        history.push("/");
    }

    return(
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar color='primary' position='static' className={classes.customizeAppBar}>
                    <Toolbar className={classes.customizeToolbar} style={{display: "flex", justifyContent: "space-between"}}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <AdminDrawer />
                            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                                {title}
                            </Typography>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <IconButton edge='end' onClick={logout}><ExitToAppIcon /></IconButton>
                            <Typography variant="button" component="div" sx={{ flexGrow: 1 }}>
                                Sign Out
                            </Typography>
                        </div>
                    </Toolbar>
                </AppBar>
                <Toolbar />
            </Box>
        </div>
    )
}

export default AdminToolbar;
