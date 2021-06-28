import React, {useState, useEffect} from 'react';
import {Grid, Container} from '@material-ui/core';

import {gridSpacing} from '../../store/constant';
import EarningCard from '../../ui-component/cards/EarningCard';
import TotalChartCard from '../../ui-component/cards/TotalChartCard';
import TotalIncomePatternCard from '../../ui-component/cards/TotalIncomePatternCard';
import TotalIncomeCard from '../../ui-component/cards/TotalIncomeCard';
import ChartCard from '../../ui-component/cards/ChartCard';
import PopularCard from '../../ui-component/cards/PopularCard';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PaymentIcon from '@material-ui/icons/Payment';
import Token from '../../abis/Token.json';
import dBank from '../../abis/dBank.json';
import Web3 from 'web3';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
}));

const Dashboard = () => {
    const [account, setAccount] = useState('');
    const [token, setToken] = useState(null);
    const [dbank, setDbank] = useState(null);
    const [dBankAddress, setDBankAddress] = useState(null);
    const [depositModelShow, setDepositModelShow] = useState(false);
    const [withdrawModelShow, setWithdrawModelShow] = useState(false);
    const [depositAmount, setDepositAmount] = useState(0);
    const [interest, setInterest] = useState(0);
    const [loadingDeposit, setLoadingDeposit] = useState(false);
    const [loadingWithdraw, setLoadingWithdraw] = useState(false);
    const classes = useStyles();
    

    const ethEnabled = () => {  
      if (window.web3) {    
        console.log(window.ethereum.enable())
        window.web3 = new Web3(window.web3.currentProvider);    
        window.ethereum.enable();    
        return true;  
      }  
      return false;
    }
    const handleDepositModal = () => {
        setDepositModelShow(!depositModelShow)
      }
      const handleWithdrawModal = () => {
        setWithdrawModelShow(!withdrawModelShow)
      }
    useEffect(() => {

        const loadBlockchainData = async () => {
          //check if MetaMask exists
          if (!ethEnabled()) { alert("Please install MetaMask to use this dApp!");}
          const netId = await window.web3.eth.net.getId();
          const accounts = await window.web3.eth.getAccounts();
          if(typeof accounts[0] !== 'undefined'){
            let balance = await window.web3.eth.getBalance(accounts[0]);
            balance = await window.web3.utils.fromWei(balance);
            console.log("Balance", balance);
            // setWeb3(web3);
            setAccount(accounts[0]);
          }else{
            window.alert('Please login with MetaMask');
          }
      
          try {
            const token = new window.web3.eth.Contract(Token.abi, Token.networks[netId].address);
            const dbank = new window.web3.eth.Contract(dBank.abi, dBank.networks[netId].address);
            const dbankAddress = dBank.networks[netId].address;
      
            setToken(token);
            setDbank(dbank);
            setDBankAddress(dbankAddress);
      
          } catch(e) {
            console.log("Error", e);
            window.alert("Contracts not deployed to the current network");
          }
        }

        loadBlockchainData();
    },[]);

    const deposit = async () => {
        if(dbank !== 'undefined'){
          try {
            // let a = await window.web3.utils.toWei(amount)
            let a = depositAmount * 10**18 //convert to wei
            console.log(a)
            setLoadingDeposit(true)
            await dbank.methods.deposit().send({
              value: a.toString(),
              from: account
            })
            .then((receipt) => {
                console.log("Receipt", receipt)
                setLoadingDeposit(false)
                window.location.reload()
            })
          }catch (e) {
            console.log('Error Deposit: ', e)
          }
        }
        
      }
    
      const withdraw = async () => {
        if(dbank !== 'undefined'){
          try {
            setLoadingWithdraw(true)
            await dbank.methods.withdraw().send({
              from: account.toString()
            })
            .then((receipt) => {
                console.log("Receipt", receipt)
                setLoadingWithdraw(false)
                window.location.reload()
            })
          }catch (e) {
            console.log('Error Withdraw: ', e)
          }
        }
        
    }


    return (
        <Container spacing={gridSpacing} >
            <Grid item xs={12} style={{marginBottom:'20px'}}>
                <Grid container  xs={12} alignItems="center">
                    <Grid lg={8} md={8} sm={8} xs={12}>
                        <Typography variant="h3" component="h2">
                            Decentralized Bank
                        </Typography>
                    </Grid>
                    <Grid item direction="row" lg={4} md={4} sm={4} xs={12}>
                        <ButtonGroup variant="contained" aria-label="contained primary button group" style={{float:'right'}}>
                            <Button color="primary" startIcon={<MonetizationOnIcon/>} onClick={() => handleDepositModal()} style={{background:""}}>
                                Deposit
                            </Button>
                            <Button color="secondary" onClick={() => handleWithdrawModal()} startIcon={<PaymentIcon/>}>
                                Withdraw
                            </Button>
                            <Dialog open={depositModelShow} onClose={handleDepositModal} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Deposit Ether</DialogTitle>
                                <DialogContent>
                                <DialogContentText>
                                    Deposit ethers and earn ORBITAL token in interest(10% APY) per second for minimum deposit amount (0.01 ETH).
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Enter Number of Ethers"
                                    type="number"
                                    fullWidth
                                    onChange={e => setDepositAmount(e.target.value)}
                                />
                                </DialogContent>
                                <DialogActions>
                                <Button onClick={handleDepositModal} color="secondary">
                                    Cancel
                                </Button>
                                <Button onClick={deposit} color="primary">
                                    {loadingDeposit ? <CircularProgress /> : `Deposit`}
                                </Button>
                                </DialogActions>
                            </Dialog>


                        {/* Withdraw Dialog */}
                        <Dialog open={withdrawModelShow} onClose={handleWithdrawModal} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Withdraw Ether</DialogTitle>
                                <DialogContent>
                                <DialogContentText>
                                    On withdraw ORBITAL token interest(10% APY) will be added into your wallet.
                                </DialogContentText>
                                <Button color="primary" onClick={() => withdraw()}>{loadingWithdraw ? <CircularProgress /> : `Withdraw`}</Button>
                                </DialogContent>
                                <DialogActions>
                                <Button onClick={handleWithdrawModal} color="secondary">
                                    Cancel
                                </Button>
                                </DialogActions>
                            </Dialog>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} style={{marginBottom:'20px'}}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <EarningCard />
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <TotalChartCard />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <TotalIncomePatternCard />
                            </Grid>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <TotalIncomeCard />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} sm={12} md={12}>
                        <ChartCard />
                    </Grid>
                    {/* <Grid item xs={12} sm={12} md={4}>
                        <PopularCard />
                    </Grid> */}
                </Grid>
            </Grid>

            
        </Container>
    );
};

export default Dashboard;
