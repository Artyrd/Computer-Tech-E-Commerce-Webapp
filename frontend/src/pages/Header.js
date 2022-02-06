import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { Box, Button, IconButton, AppBar, Toolbar } from '@mui/material';
import { grey } from '@mui/material/colors';
import { makeStyles } from '@mui/styles';
import stargateLogo from '../img/stargate.png'
import Search from '../components/Search';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ThemeColour from './ThemeColour';
import {CartDrawer }from '../components/general/GeneralComponents'

/**
 * The header of every page a customer can view, includes a search bar and 
 * provides links to the following pages:
 *      - Homepage
 *      - Wishlist
 *      - Cart
 *      - User Dashboard
 *      - Logout
 *      - Product catalogue
 *      - Recommender Survey
 * 
 * @returns Header
 */
function Header() {

    const theme = ThemeColour();
    const useStyles = makeStyles({
        customizeAppBar: {
            minHeight: 100
        },
        lowerAppBar: {
          minHeight:5
        }
    });
    const classes = useStyles();

    function profile() {
        if (localStorage.getItem("token") === null) {
            return(
                <Link to='/login' >
                    <IconButton><PersonIcon sx={{ color: grey[50]}} fontSize='large'/></IconButton>
                </Link>
            )
        }
        else {
            return(
                <div>
                    <Link to={'/profile/'+localStorage.getItem('customerid')} >
                        <IconButton><PersonIcon sx={{ color: grey[50]}} fontSize='large'/></IconButton>
                    </Link>
                    <Link to={'/'}>
                        <IconButton onClick={() => {localStorage.removeItem('token'); localStorage.removeItem('customerid')}}>
                            <ExitToAppIcon sx={{ color: grey[50]}} fontSize='large'/>
                        </IconButton>
                    </Link>
                </div>
            )
        }
        
    }

    return(
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <ThemeProvider theme={theme} >
                    <AppBar color='darkblue' position='static' className={classes.customizeAppBar}>
                        <Toolbar style={{display: "flex", flexWrap: 'wrap', justifyContent: "space-between", alignContent: 'center', minHeight:100}}>
                            <div style={{display: 'flex'}}>
                                <Link to="/">
                                    <img src={stargateLogo} alt="StarGate" style={{pointerEvents:"all", height: "min(75px, 7.5vh)"}}/>
                                </Link>
                            </div>
                            <div>
                                <Search />
                            </div>
                            <div style={{display: 'flex'}}>
                                <Link to='/profile/wishlist' >
                                    <IconButton><StarIcon sx={{ color: '#EDD071'}} fontSize='large'/></IconButton>
                                </Link>
                                <CartDrawer/>
                                {profile()}
                            </div>
                        </Toolbar>
                    </AppBar>
                </ThemeProvider>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <ThemeProvider theme={theme}>
                <AppBar color='medblue' position='static' className={classes.lowerAppBar}>
                  <Toolbar style={{display: "flex", justifyContent: "flex-start", alignContent: 'center', minHeight:50}}>
                    <div style={{ marginLeft:'20px', backgroundColor:'#113f69', width:'100px'}}>
                      <Button component={Link} to="/products" color="white">Products</Button>
                    </div>
                    <div style={{backgroundColor:'#113f69', width:'300px'}}>
                      <Button component={Link} to="/recommender" color="white">Build Your Own</Button>
                    </div>
                  </Toolbar>
                </AppBar>
              </ThemeProvider>
            </Box>
        </div>
    )
}


export default Header;