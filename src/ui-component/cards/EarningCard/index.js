import React, { useEffect, useState } from 'react';
import {Avatar, Card, CardContent, Grid, makeStyles, Menu, MenuItem, Typography} from '@material-ui/core';

import EarningIcon from './../../../assets/images/icons/earning.svg';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import GetAppTwoToneIcon from '@material-ui/icons/GetAppOutlined';
import FileCopyTwoToneIcon from '@material-ui/icons/FileCopyOutlined';
import PictureAsPdfTwoToneIcon from '@material-ui/icons/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@material-ui/icons/ArchiveOutlined';

import dBank from "../../../abis/dBank.json";

const useStyles = makeStyles((theme) => ({
    card: {
        backgroundColor: theme.palette.purple.main,
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
        '&:after': {
            content: '""',
            position: 'absolute',
            width: '210px',
            height: '210px',
            backgroundColor: theme.palette.purple.dark,
            borderRadius: '50%',
            top: '-85px',
            right: '-95px',
            [theme.breakpoints.down('xs')]: {
                top: '-105px',
                right: '-140px'
            }
        },
        '&:before': {
            content: '""',
            position: 'absolute',
            width: '210px',
            height: '210px',
            backgroundColor: theme.palette.purple.dark,
            borderRadius: '50%',
            top: '-125px',
            right: '-15px',
            opacity: 0.7,
            [theme.breakpoints.down('xs')]: {
                top: '-155px',
                right: '-70px'
            }
        }
    },
    content: {
        padding: '20px !important'
    },
    avatar: {
        ...theme.typography.commonAvatar,
        ...theme.typography.largeAvatar,
        backgroundColor: theme.palette.purple.dark,
        marginTop: '8px'
    },
    avatarRight: {
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        backgroundColor: theme.palette.purple.main,
        color: theme.palette.purple[200],
        zIndex: 1
    },
    cardHeading: {
        fontSize: '2.125rem',
        fontWeight: 500,
        marginRight: '8px',
        marginTop: '18px',
        marginBottom: '8px'
    },
    subHeading: {
        fontSize: '1.5rem',
        fontWeight: 500,
        color: theme.palette.purple[200]
    },
    avatarCricle: {
        cursor: 'pointer',
        ...theme.typography.smallAvatar,
        backgroundColor: theme.palette.purple[200],
        color: theme.palette.purple.dark
    },
    circleIcon: {
        transform: 'rotate3d(1, 1, 1, 45deg)'
    },
    menuItem: {
        marginRight: '14px',
        fontSize: '1.25rem'
    }
}));

const EarningCard = () => {
    const classes = useStyles();

    const [totalBalance, setTotalBalance] = useState(0.00);
    useEffect(() => {
        const getTotalBalance = async () => {
            const accounts = await window.web3.eth.getAccounts();
            const netId = await window.web3.eth.net.getId();
            const dbank = new window.web3.eth.Contract(dBank.abi, dBank.networks[netId].address);
            let totalBalance = parseFloat(await window.web3.utils.fromWei(await dbank.methods.depositsBalance().call())).toFixed(4)
            setTotalBalance(totalBalance)
        }
        getTotalBalance()
    },[]);

    return (
        <Card className={classes.card}>
            <CardContent className={classes.content}>
                <Grid container direction="column">
                    <Grid item>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Avatar variant="rounded" className={classes.avatar}>
                                    <img src={EarningIcon} alt="Notification" />
                                </Avatar>
                            </Grid>
       
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container alignItems="center">
                            <Grid item>
                                <Typography className={classes.cardHeading}>{totalBalance} ETH</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography className={classes.subHeading}>Total Staked Value</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default EarningCard;
