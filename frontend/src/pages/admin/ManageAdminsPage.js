import {React, useEffect, useState} from 'react';
import {Button, Card, CardContent, Snackbar, Alert, IconButton} from '@mui/material';
import RenderAdminData from '../../components/admin/RenderAdminData';
import './AdminPages.css';
import Alerts from '../../components/Alerts';
import SearchBar from 'material-ui-search-bar';
import CloseIcon from '@mui/icons-material/Close';
import AdminHeader from '../../components/admin/AdminHeader';
import ThemeColour from '../ThemeColour';
import { ThemeProvider } from '@mui/material/styles';
import { BACKEND_PORT } from '../../config.json';

/**
 * Creates a page to manage account admin privileges, registered users are 
 * displayed in a table providing their details and their admin privileges.
 * The priviledges can be updated within the table and by default it shows all 
 * registered users but is an option to display admin only. 
 * 
 * @returns ManageAdminsPage
 */
function ManageAdminsPage() {
    // Load page themes
    const theme = ThemeColour();

    // Admin data states
    const [adminList, setAdminList] = useState([]);
    const [searchID, setSearchID] = useState("");

    // Alert handlers
    const [openSuccess, setSuccess] = useState(false);
    const [openFail, setFail] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);
    const handleSuccess = () => {
      setSuccess(true);
    };
    const handleFail = () => {
      setFail(true);
    };

    // Backend call to get all users
    async function getAll(event) {
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/admin/get_all', {
            method: 'GET',
            headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
        })
        const data = await response.json();
        setAdminList(data.users);
    }
    // Get all users on page load
    useEffect(() => {getAll()}, []);

    // Backend call to get all administrators
    async function getAdmins(event) {
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/admin/manage', {
            method: 'GET',
            headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
        })
        const data = await response.json();
        setAdminList(data.admin);
        
    }

    // Backend call to get a user for given customerid: searchID
    async function getSearch(event) {
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/admin/manage/'+searchID, {
            method: 'GET',
            headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
        })
        const data = await response.json();
        if (response.status !== 200) {
            setOpenSearch(true);
        }
        else {
            setAdminList([data])
        }
    }

    // Display user data for given list of users
    function renderData() {

        var admins = [];
        for (var i = 0; i < adminList.length; i++) {
            var admin = <RenderAdminData 
                            admin={adminList[i]} 
                            handleSuccess={handleSuccess}
                            handleFail={handleFail}/>;
            admins.push(admin);
        }
        return (admins);
    }

    return(
        <div>
            <AdminHeader />
            <div style={{paddingTop:50, paddingLeft: 50}}>
                <ThemeProvider theme={theme}>
                    <Card id='card' style={{width: 530}}>
                        <CardContent>
                            <SearchBar
                                value={searchID}
                                onChange={(newValue) => setSearchID(newValue)}
                                onRequestSearch={() => {setAdminList([]); getSearch()}}
                                style={{width: "min(500px, 50vw)"}}
                                placeholder='Search User ID'
                            />
                            <div style={{display:'flex', paddingTop: 15}}>
                                <div style={{paddingRight: 25}}>
                                    <Button color='medblue' variant = 'contained' onClick={getAll}>
                                        Get All Users
                                    </Button>
                                </div>
                                <Button color='medblue' variant = 'contained' onClick={getAdmins}>
                                    Get All Admins Only
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <div style={{paddingTop: 25, paddingRight:50}}>
                        <table id = "table">
                            <thead style={{backgroundColor:'#D1DEEC'}}>
                                <tr>
                                    <th>User ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Registration Date</th>
                                    <th>Termination Date</th>
                                    <th>Account Position</th>
                                    <th>Admin Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderData()}
                            </tbody>
                        </table>
                    </div>
                </ThemeProvider>
            </div>
            <Alerts 
                openSuccess={openSuccess}
                openFail={openFail}
                setSuccess={setSuccess}
                setFail={setFail}
                textSuccess={"Successfully editted admin"}
                textFail={"Could not edit admin"}
            />
            <Snackbar open={openSearch} anchorOrigin={{vertical: 'top', horizontal:'center'}} autoHideDuration={6000} onClose={() => setOpenSearch(false)}>
                <Alert action={
                        <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpenSearch(false);
                        }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    variant="filled" severity="error" sx={{ width: '100%' }}>
                    Could not find User ID {searchID}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default ManageAdminsPage;