import {React, useState} from 'react';
import { Drawer, Divider, IconButton } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import ExitToApp from '@mui/icons-material/ExitToApp';
import {grey} from '@mui/material/colors';

/**
 * Admin navigation drawer
 * 
 * @returns AdminDrawer
 */
function AdminDrawer() {

    // Handle displaying the drawer
    const [open, setOpen] = useState(false);
    function openDrawer() {
        setOpen(true);
    }
    function closeDrawer() {
        setOpen(false);
    }
    
    // Style links
    const styles = {
        link: {
            color: 'black',
            textDecoration: 'none',
        }
    };

    // Return navigation drawer with page navigation links
    return(
        <div>
         <div>
            <IconButton onClick={openDrawer}>
              <MenuIcon sx={{ color: grey[50]}} fontSize='large'/>
            </IconButton>
          </div>
          <Divider/>
        <Drawer
          variant="temporary"
          open={open}
          onClose={closeDrawer}
        >
          <Link to='/admin' style={styles.link}>
            <List>
              <ListItem button key='Dashboard'>
                <ListItemIcon><HomeIcon/></ListItemIcon>
                <ListItemText primary='Dashboard' />
              </ListItem>
            </List>
          </Link>
          <Link to='/admin/products/add' style={styles.link}>
            <List>
              <ListItem button key='Add a Product'>
                <ListItemIcon><AddIcon/></ListItemIcon>
                <ListItemText primary='Add a Product' />
              </ListItem>
            </List>
          </Link>
          <Link to='/admin/products/view' style={styles.link}>
            <List>
              <ListItem button key='View All Products'>
                <ListItemIcon><EditIcon/></ListItemIcon>
                <ListItemText primary='View All Products' />
              </ListItem>
            </List>
          </Link>
          <Link to='/admin/products/specials' style={styles.link}>
            <List>
              <ListItem button key='Manage Sale Specials'>
                <ListItemIcon><AttachMoneyIcon/></ListItemIcon>
                <ListItemText primary='Manage Sale Specials' />
              </ListItem>
            </List>
          </Link>
          <Link to='/admin/view_orders' style={styles.link}>
            <List>
              <ListItem button key='View Order Details'>
                <ListItemIcon><ShoppingCartIcon/></ListItemIcon>
                <ListItemText primary='View Order Details' />
              </ListItem>
            </List>
          </Link>
          <Link to='/admin/view_statistics/sales' style={styles.link}>
            <List>
              <ListItem button key='View Sales Statistics'>
                <ListItemIcon><TrendingUpIcon/></ListItemIcon>
                <ListItemText primary='View Sales Statistics' />
              </ListItem>
            </List>
          </Link>
          <Link to='/admin/manage/admins' style={styles.link}>
            <List>
              <ListItem button key='Manage Admins'>
                <ListItemIcon><PeopleIcon/></ListItemIcon>
                <ListItemText primary='Manage Admins' />
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
  
export default AdminDrawer;