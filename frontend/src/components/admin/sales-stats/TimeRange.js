import React from 'react';
import {Radio, FormControlLabel, TextField, RadioGroup} from '@mui/material';

/**
 * Functional component handling the start and end dates to display statistical data
 * 
 * @param {start} date 
 * @param {end} date 
 * @param {timeSpan} int 
 * @param {setStart} function 
 * @param {setEnd} function 
 * @param {setTimeSpan} function 
 * @param {setDays} function 
 * @returns TimeRange
 */
function TimeRange({start, end, timeSpan, setStart, setEnd, setTimeSpan, setDays}) {

    // Handle input on the start date
    function handleStart(event) {
        setStart(event.target.value);
        setTimeSpan("");
    }
    // Handle input on the end date
    function handleEnd(event) {
        setEnd(event.target.value);
    }
    // Handle preset date ranges to set the start date a preset amount from the end date
    function handleRadio(event) {
        // If user de-selects the preset
        if (event.target.value === timeSpan) {
            setTimeSpan("");
        } 
        else {
            setTimeSpan(event.target.value);
            var endDate = new Date(end);
            var milliseconds = 0;
            if (event.target.value === '1W') {
                milliseconds = 7 * 1000 * 3600 * 24;
                setDays(7);
            }
            else if (event.target.value === '2W') {
                milliseconds = 14 * 1000 * 3600 * 24;
                setDays(14);
            }
            else if (event.target.value === '1M') {
                milliseconds = 30 * 1000 * 3600 * 24;
                setDays(30);
            }
            else if (event.target.value === '3M') {
                milliseconds = 90 * 1000 * 3600 * 24;
                setDays(90);
            }
            else if (event.target.value === '6M') {
                milliseconds = 180 * 1000 * 3600 * 24;
                setDays(180);
            }
            else if (event.target.value === '1Y') {
                milliseconds = 365 * 1000 * 3600 * 24;
                setDays(365);
            }
            else if (event.target.value === '2Y') {
                milliseconds = 730 * 1000 * 3600 * 24;
                setDays(730);
            }

            // Calculate new start date as a a string
            var startSeconds = endDate.getTime() - milliseconds;
            var startDate = new Date();
            startDate.setTime(startSeconds);
            var numDate = startDate.getDate().toString();
            if (numDate.length === 1) {
                numDate = '0' + numDate;
            }
            var numMonth = startDate.getMonth().toString();
            numMonth = (parseInt(numMonth) + 1).toString();
            if (numMonth.length === 1) {
                numMonth = '0' + numMonth;
            }
            setStart(startDate.getFullYear() + '-' + numMonth + '-' + numDate);
        }
    }

    // Return functional time selection component
    return (
        <div style={{display: 'flex', justifyContent:'space-evenly'}}>
            <div style={{display: 'flex', alignItems:'center', paddingRight: 15}}>
                <TextField
                    id={"start"}
                    type="date"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    onChange={handleStart}
                    label="Start Date"
                    value={start}
                    sx={{backgroundColor: '#fff'}}
                />
                <TextField
                    id={"end"}
                    type="date"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    onChange={handleEnd}
                    label="End Date"
                    defaultValue={end}
                    sx={{backgroundColor: '#fff'}}
                />
            </div>
            <RadioGroup row value={timeSpan}>
                <FormControlLabel value ='1W' control={<Radio onClick={handleRadio} color='lightblue'/>} label="1W" />
                <FormControlLabel value ='2W' control={<Radio onClick={handleRadio} color='lightblue'/>} label="2W" />
                <FormControlLabel value ='1M' control={<Radio onClick={handleRadio} color='lightblue'/>} label="1M" />
                <FormControlLabel value ='3M' control={<Radio onClick={handleRadio} color='lightblue'/>} label="3M" />
                <FormControlLabel value ='6M' control={<Radio onClick={handleRadio} color='lightblue'/>} label="6M" />
                <FormControlLabel value ='1Y' control={<Radio onClick={handleRadio} color='lightblue'/>} label="1Y" />
                <FormControlLabel value ='2Y' control={<Radio onClick={handleRadio} color='lightblue'/>} label="2Y" />
            </RadioGroup>
        </div>
    );
}

export default TimeRange;