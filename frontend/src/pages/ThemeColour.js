import { createTheme } from '@mui/material/styles';

function ThemeColour() {

    const theme = createTheme({
        palette: {
            darkblue: {
                main: '#062241',
                contrastText: '#fff',
            },
            medblue: {
                main: '#173C5E',
                contrastText: '#fff',
            },
            lightblue: { 
                main: '#5C7FA1',
                contrastText: '#fff',
            },
            grey: {
                main: '#D1DEEC',
                contrastText: '#173C5E',
            },
            yellow: {
              main: '#edd071',
              contrastText: '#173C5E',
            },
            warning: {
                main: '#ff1744',
                contrastText: '#fff',
            },            
            white: {
              main: "#FFFFF",
            },
            tonalOffset: 0.1,
        },
    });

    return(theme);
}

export default ThemeColour;