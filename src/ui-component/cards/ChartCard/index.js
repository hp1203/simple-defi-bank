import React from 'react';
import {Card, CardContent, Grid, MenuItem, TextField, Typography, useTheme} from '@material-ui/core';
import Chart from 'react-apexcharts';
import barChart from './chart/bar-chart';
import {gridSpacing} from '../../../store/constant';
import TradingViewWidget, { Themes, BarStyles } from 'react-tradingview-widget';
const status = [
    {
        value: 'today',
        label: 'Today'
    },
    {
        value: 'month',
        label: 'This Month'
    },
    {
        value: 'year',
        label: 'This Year'
    }
];

const ChartCard = () => {
    const [value, setValue] = React.useState('today');
    const theme = useTheme();

    const primary = theme.palette.secondary.main;
    barChart.options.grid.borderColor = theme.palette.primary.light;
    barChart.options.yaxis.labels.style.colors = [theme.palette.secondary.main];
    barChart.options.xaxis.labels.style.colors = [primary, primary, primary, primary, primary, primary, primary];

    return (
        <Card>
            <CardContent>
                <Grid container spacing={gridSpacing}>
                
                    <Grid item xs={12}>
                    <TradingViewWidget
                        symbol="COINBASE:ETHUSD"
                        theme={Themes.LIGHT}
                        width={'100%'}
                        height={500}
                    />

                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default ChartCard;
