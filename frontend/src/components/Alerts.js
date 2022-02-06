import React from 'react';
import { IconButton } from '@material-ui/core';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Creates a alert (success or fail) on the current screen with the given text 
 * 
 * @param {openSuccess} boolean 
 * @param {openFail} boolean 
 * @param {setSuccess} function 
 * @param {setFail} function 
 * @param {textSuccess} string 
 * @param {textFail} string 
 * @returns Alerts
 */
function Alerts({openSuccess, openFail, setSuccess, setFail, textSuccess, textFail}) {

    return (
        <div>
            <Snackbar open={openSuccess} autoHideDuration={6000} onClose={() => setSuccess(false)}>
                <Alert action={
                        <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setSuccess(false);
                        }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    variant="filled" severity="success" sx={{ width: '100%' }}>
                    {textSuccess}
                </Alert>
            </Snackbar>
            <Snackbar open={openFail} autoHideDuration={6000} onClose={() => setFail(false)}>
                <Alert action={
                        <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setFail(false);
                        }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    variant="filled" severity="error" sx={{ width: '100%' }}>
                    {textFail}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Alerts;