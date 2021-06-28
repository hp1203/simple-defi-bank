import React, { useEffect, useState } from 'react';
import {Avatar, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, makeStyles, Typography} from '@material-ui/core';

import TableChartOutlinedIcon from '@material-ui/icons/TableChartOutlined';

const useStyles = makeStyles((theme) => ({
    card: {
        backgroundColor: "#617DEA",
        color: theme.palette.primary.light,
        overflow: 'hidden',
        position: 'relative',
        '&:after': {
            content: '""',
            position: 'absolute',
            width: '210px',
            height: '210px',
            background: 'linear-gradient(210.04deg, #90CAF9 -50.94%, rgba(144, 202, 249, 0) 83.49%)',
            borderRadius: '50%',
            top: '-30px',
            right: '-180px'
        },
        '&:before': {
            content: '""',
            position: 'absolute',
            width: '210px',
            height: '210px',
            background: 'linear-gradient(140.9deg, #90CAF9 -14.02%, rgba(144, 202, 249, 0) 77.58%)',
            borderRadius: '50%',
            top: '-160px',
            right: '-130px'
        }
    },
    content: {
        padding: '16px !important'
    },
    avatar: {
        ...theme.typography.commonAvatar,
        ...theme.typography.largeAvatar,
        backgroundColor: "#617DEA",
        color: '#fff',
        borderRadius: "50px"
    },
    primary: {
        color: '#fff'
    },
    secondary: {
        color: theme.palette.primary.light,
    },
    padding: {
        paddingTop: 0,
        paddingBottom: 0
    }
}));

const TotalIncomePatternCard = () => {
    const classes = useStyles();
    const [ethBalance, setEthBalance] = useState(0.00);
    useEffect(() => {
        const getEthBalance = async () => {
            const accounts = await window.web3.eth.getAccounts();
            let ethBalance = parseFloat(await window.web3.utils.fromWei(await window.web3.eth.getBalance(accounts[0]))).toFixed(4)
            setEthBalance(ethBalance)
        }
        getEthBalance()
    },[]);
    return (
        <Card className={classes.card}>
            <CardContent className={classes.content}>
                <List className={classes.padding}>
                    <ListItem alignItems="center" disableGutters className={classes.padding}>
                        <ListItemAvatar>
                            <Avatar variant="rounded" className={classes.avatar} src="https://png.pngitem.com/pimgs/s/124-1245793_ethereum-eth-icon-ethereum-png-transparent-png.png"/>
                        </ListItemAvatar>
                        <ListItemText
                            className={classes.padding}
                            primary={
                                <Typography variant="h3" className={classes.primary}>
                                    {ethBalance} ETH
                                </Typography>
                            }
                            secondary={
                                <Typography variant="subtitle2" className={classes.secondary}>
                                    Your Ether Balance
                                </Typography>
                            }
                        />
                    </ListItem>
                </List>
            </CardContent>
        </Card>
    );
};

export default TotalIncomePatternCard;
