import getMuiTheme from "material-ui/styles/getMuiTheme";
import { pink100, lightBlue100 } from "material-ui/styles/colors";

export function customizeTheme(theme) {
    const newTheme = Object.assign({tableRow: {}, tabs: {}}, theme);

    newTheme.palette.primary1Color = "#1B9F7D";
    newTheme.palette.primary2Color = "#0E5676";
    newTheme.palette.primary3Color = "#757575";
    newTheme.palette.primary4Color = "#9C0227";
    newTheme.palette.primary5Color = "#F5F5F5";
    newTheme.palette.primary6Color = "#3D3D3D";
    newTheme.palette.primary7Color = "#D7D7D7";
    newTheme.palette.canvasColor = "#fff";
    newTheme.palette.accent1Color = "#9D0072";
    newTheme.palette.accent2Color = "#9E7B20";
    newTheme.palette.accent3Color = "#759F27";
    newTheme.palette.accent4Color = pink100;
    newTheme.palette.accent5Color = lightBlue100;
    newTheme.tableRow.hoverColor = 'rgba(0, 0, 0, 0.15)';
    newTheme.tableRow.stripeColor = 'whitesmoke';
    newTheme.tabs.backgroundColor = 'white';
    newTheme.tabs.textColor = 'gray';
    newTheme.tabs.selectedTextColor = '#005778';

    return getMuiTheme(newTheme);
}

export function getPatientAnswer(index) {
    switch (index) {
    case 1: return "estimator.survey.q.agree_plus";
    case 2: return "estimator.survey.q.agree";
    case 3: return "estimator.survey.q.agree_minus";
    case 4: return "estimator.survey.q.disagree_minus";
    case 5: return "estimator.survey.q.disagree";
    case 6:
    default: return "estimator.survey.q.disagree_plus";
    }
}
