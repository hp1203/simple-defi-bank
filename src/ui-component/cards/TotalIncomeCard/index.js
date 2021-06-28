import React, {useEffect, useState} from 'react';
import {Avatar, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, makeStyles, Typography} from '@material-ui/core';

import StorefrontTwoToneIcon from '@material-ui/icons/StorefrontTwoTone';
import Token from '../../../abis/Token.json'
const useStyles = makeStyles((theme) => ({
    card: {
        backgroundColor: "#9147C6",
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
        backgroundColor: theme.palette.warning.light,
        color: theme.palette.warning.light,
        borderRadius: "50px"
    },
    primary:{
        color: "#fff"
    },
    secondary: {
        color: theme.palette.primary.light,

    },
    padding: {
        paddingTop: 0,
        paddingBottom: 0
    }
}));

const TotalIncomeCard = () => {
    const classes = useStyles();
    const [orbitalBalance, setOrbitalBalance] = useState(0.00);
    useEffect(() => {
        const getOrbitalBalance = async () => {
            const accounts = await window.web3.eth.getAccounts();
            const netId = await window.web3.eth.net.getId();
            const token = new window.web3.eth.Contract(Token.abi, Token.networks[netId].address);
            let orbitalBalance = parseFloat(await window.web3.utils.fromWei(await token.methods.balanceOf(accounts[0]).call())).toFixed(4)
            setOrbitalBalance(orbitalBalance)
        }
        getOrbitalBalance()
    },[]);
    return (
        <Card className={classes.card}>
            <CardContent className={classes.content}>
                <List className={classes.padding}>
                    <ListItem alignItems="center" disableGutters className={classes.padding}>
                        <ListItemAvatar>
                            <Avatar variant="rounded" className={classes.avatar} src="https://qualified.one/static/img/content/logos/orbital-innovation_logo.png"/>
                        </ListItemAvatar>
                        <ListItemText
                            className={classes.padding}
                            primary={
                                <Typography variant="h3" className={classes.primary}>
                                    {orbitalBalance} ORBITAL
                                </Typography>
                            }
                            secondary={
                                <Typography variant="subtitle2" className={classes.secondary}>
                                    Your Orbital Token Balance
                                </Typography>
                            }
                        />
                    </ListItem>
                </List>
            </CardContent>
        </Card>
    );
};

export default TotalIncomeCard;
