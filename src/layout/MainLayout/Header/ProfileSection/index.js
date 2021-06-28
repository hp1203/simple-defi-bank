import React, { useState } from "react";
import { useSelector } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Avatar,
  Card,
  CardContent,
  Chip,
  ClickAwayListener,
  Divider,
  Fade,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  OutlinedInput,
  Paper,
  Popper,
  Switch,
  Typography,
  useTheme,
} from "@material-ui/core";

import { IconLogout, IconSearch, IconSettings } from "@tabler/icons";

import UpgradePlanCard from "../../../../ui-component/cards/UpgradePlanCard";

import User1 from "./../../../../assets/images/users/user-round.svg";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import Blockies from "react-blockies";
import Web3 from "web3";
import MiddleEllipsis from "react-middle-ellipsis";
const useStyles = makeStyles((theme) => ({
  navContainer: {
    width: "100%",
    maxWidth: "350px",
    minWidth: "300px",
    backgroundColor: theme.palette.background.paper,
    borderRadius: "10px",
    [theme.breakpoints.down("sm")]: {
      minWidth: "100%",
    },
  },
  headerAvtar: {
    cursor: "pointer",
    ...theme.typography.mediumAvatar,
    margin: "8px 0 8px 8px !important",
  },
  profileChip: {
    maxWidth: "200px",
    height: "48px",
    alignItems: "center",
    borderRadius: "27px",
    transition: "all .2s ease-in-out",
    borderColor: theme.palette.primary.light,
    backgroundColor: theme.palette.primary.light,
    '&[aria-controls="menu-list-grow"], &:hover': {
      borderColor: theme.palette.primary.main,
      background: theme.palette.primary.main + "!important",
      color: theme.palette.primary.light,
      "& svg": {
        stroke: theme.palette.primary.light,
      },
    },
  },
  profileLabel: {
    lineHeight: 0,
    padding: "12px",
  },
  listItem: {
    marginTop: "5px",
  },
  cardContent: {
    padding: "16px !important",
  },
  card: {
    backgroundColor: theme.palette.primary.light,
    marginBottom: "16px",
    marginTop: "16px",
  },
  searchControl: {
    width: "100%",
    paddingRight: "8px",
    paddingLeft: "16px",
    marginBottom: "16px",
    marginTop: "16px",
  },
  startAdornment: {
    fontSize: "1rem",
    color: theme.palette.grey[500],
  },
  flex: {
    display: "flex",
  },
  name: {
    marginLeft: "2px",
    fontWeight: 400,
  },
  ScrollHeight: {
    height: "100%",
    maxHeight: "calc(100vh - 250px)",
    overflowX: "hidden",
  },
  badgeyellow: {
    backgroundColor: theme.palette.warning.dark,
    color: "#fff",
  },
}));

const ProfileSection = () => {
  const classes = useStyles();
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const [selectedIndex] = React.useState(1);

  const [account, setAccount] = useState("");

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const handleLogout = async () => {
    try {
      window.ethereum.disable();
    } catch (err) {
      console.error(err);
    }
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };
  const ethEnabled = async () => {
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      window.ethereum.enable();
      return true;
    }
    return false;
  };

  React.useEffect(() => {
    const checkMetaMask = async () => {
      //check if MetaMask exists
      if (!ethEnabled()) {
        alert("Please install MetaMask to use this dApp!");
      }
      const accounts = await window.web3.eth.getAccounts();
      if (typeof accounts[0] !== "undefined") {
        setAccount(accounts[0]);
      } else {
        window.alert("Please login with MetaMask");
      }
    };
    checkMetaMask();
  }, []);
  const prevOpen = React.useRef(open);
  var icon = (
    <Blockies
      seed="0xF1e0537dF34f818b6cBf5614806AC9331aD61e6a"
      size={10}
      scale={3}
      color="#dfe"
      bgColor="#aaa"
      spotColor="#000"
      className="identicon"
    />
  );

  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <React.Fragment>
      {!window.web3 ? (
        <Chip
          classes={{ label: classes.profileLabel }}
          className={classes.profileChip}
          label="Connect Wallet"
          variant="outlined"
          onClick={ethEnabled}
          color="primary"
        />
      ) : (
        <>
          <Chip
            classes={{ label: classes.profileLabel }}
            className={classes.profileChip}
            icon={
              <Avatar
                src={
                  <Blockies
                    seed={account}
                    size={10}
                    scale={3}
                    color="#dfe"
                    bgColor="#aaa"
                    spotColor="#000"
                    style={{ borderRadius: 50 }}
                  />
                }
                className={classes.headerAvtar}
                ref={anchorRef}
                aria-controls={open ? "menu-list-grow" : undefined}
                aria-haspopup="true"
                color="inherit"
              />
            }
            label={
              <MiddleEllipsis>
                <span>{account}</span>
              </MiddleEllipsis>
            }
            variant="outlined"
            ref={anchorRef}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            color="primary"
          />
          <Popper
            placement="bottom-end"
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
            popperOptions={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 14],
                  },
                },
              ],
            }}
          >
            {({ TransitionProps, placement }) => (
              <Fade {...TransitionProps}>
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <Card elevation={16}>
                      <CardContent className={classes.cardContent}>
                        <PerfectScrollbar className={classes.ScrollHeight}>
                          <Card className={classes.card}>
                            <CardContent>
                              <Grid container direction="column">
                                <Grid item>
                                  <Grid
                                    item
                                    justifyContent="center"
                                    alignItems="center"
                                  >
                                  
                                    <Avatar
                                      src={User1}
                                      style={{
                                        width: "100px",
                                        height: "100px",
                                        margin: "10px auto",
                                      }}
                                      color="inherit"
                                    />
                                  </Grid>
                                </Grid>
                                <Grid container direction="row" spacing={2}>
                                  <Grid item style={{maxWidth:'300px'}}>
                                      <MiddleEllipsis>
                                          <span style={{fontWeight:"bold"}}>
                                          {account}
                                          </span>
                                      </MiddleEllipsis>
                                  </Grid>
                                  <Grid>
                                      <IconButton aria-label="delete">
                                          <FileCopyIcon fontSize="small"/>
                                      </IconButton>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                          <Divider />
                          <List
                            component="nav"
                            className={classes.navContainer}
                          >
                            {/* <ListItem
                                                        className={classes.listItem}
                                                        sx={{borderRadius: customization.borderRadius + 'px'}}
                                                        button
                                                        selected={selectedIndex === 3}
                                                        onClick={(event) => handleListItemClick(event, 3)}
                                                    >
                                                        <ListItemIcon>
                                                            <IconLock stroke={1.5} size="1.3rem" />
                                                        </ListItemIcon>
                                                        <ListItemText primary={<Typography variant="body2">Lock Screen</Typography>} />
                                                    </ListItem> */}
                            <ListItem
                              className={classes.listItem}
                              sx={{
                                borderRadius: customization.borderRadius + "px",
                              }}
                              button
                              selected={selectedIndex === 4}
                              onClick={handleLogout}
                            >
                              <ListItemIcon>
                                <PowerSettingsNewIcon
                                  stroke={1.5}
                                  size="1.3rem"
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography variant="body2">
                                    Disconnect
                                  </Typography>
                                }
                              />
                            </ListItem>
                          </List>
                        </PerfectScrollbar>
                      </CardContent>
                    </Card>
                  </ClickAwayListener>
                </Paper>
              </Fade>
            )}
          </Popper>
        </>
      )}
    </React.Fragment>
  );
};

export default ProfileSection;
