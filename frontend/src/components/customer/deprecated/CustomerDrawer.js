import {React, useState} from 'react';
import { Drawer, Divider, IconButton } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Link } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import ExitToApp from '@mui/icons-material/ExitToApp';
import BookmarkIcon from '@mui/icons-material/Bookmark';

/**
 * 
 * 
 * @returns CustomerDrawer
 */
function CustomerDrawer() {

    const [open, setOpen] = useState(false);
    
    const styles = {
        link: {
            color: 'black',
            textDecoration: 'none',
        }
    };

    function openDrawer() {
        setOpen(true);
    }
    function closeDrawer() {
        setOpen(false);
    }

    return(
        <div>
         <div>
            <IconButton onClick={openDrawer}>
              <MenuIcon/>
            </IconButton>
          </div>
          <Divider/>
        <Drawer
          variant="temporary"
          open={open}
          onClose={closeDrawer}
        >
          <Link to='/profile' style={styles.link}>
            <List>
              <ListItem button key='Dashboard'>
                <ListItemIcon><HomeIcon/></ListItemIcon>
                <ListItemText primary='Dashboard' />
              </ListItem>
            </List>
          </Link>
          <Link to='/profile/edit' style={styles.link}>
            <List>
              <ListItem button key='Edit My Profile'>
                <ListItemIcon><PeopleIcon/></ListItemIcon>
                <ListItemText primary='Edit My Profile' />
              </ListItem>
            </List>
          </Link>
          <Link to='/profile/wishlists' style={styles.link}>
            <List>
              <ListItem button key='View My Wishlists'>
                <ListItemIcon><BookmarkIcon/></ListItemIcon>
                <ListItemText primary='View My Wishlists' />
              </ListItem>
            </List>
          </Link>
          <Link to='/profile/order_history' style={styles.link}>
            <List>
              <ListItem button key='View Order History'>
                <ListItemIcon><ShoppingCartIcon/></ListItemIcon>
                <ListItemText primary='View Order History' />
              </ListItem>
            </List>
          </Link>
          <Link to='/' style={styles.link}>
            <List>
              <ListItem button key='Go to Stargate Home'>
                <ListItemIcon><ExitToApp/></ListItemIcon>
                <ListItemText primary='Go to Stargate Home' />
              </ListItem>
            </List>
          </Link>
        </Drawer>
      </div>
    );

}
  
export default CustomerDrawer;