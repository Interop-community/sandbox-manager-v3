import {teal, pink, lightBlue, deepOrange} from "@material-ui/core/colors";

export function customizeTheme() {
    return {
        p1: '#1B9F7D',
        p2: '#C8D0C8',
        p3: '#757575',
        p4: '#9C0227',
        p5: '#F5F5F5',
        p6: '#3D3D3D',
        p7: '#D7D7D7',
        p8: 'whitesmoke',
        p9: '#478454',
        p10: '#325C41',
        a1: '#9D0072',
        a2: '#9E7B20',
        a3: '#759F27',
        a4: pink,
        a5: lightBlue,
        st: '#00577',
        palette: {
            primary: {
                light: 'rgb(64, 128, 122)',
                main: 'rgb(64, 128, 122)',
                dark: 'rgb(64, 128, 122)',
                contrastText: '#FFF'
            },
            secondary: {
                light: 'rgb(191, 120, 86)',
                main: 'rgb(191, 120, 86)',
                dark: 'rgb(191, 120, 86)',
                contrastText: '#FFF'
            },
            error: deepOrange
        }
    };
}

export function isUrlValid(userInput) {
    return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(userInput);
}