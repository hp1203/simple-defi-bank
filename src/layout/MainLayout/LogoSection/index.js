import React from 'react';
import {Link} from '@material-ui/core';
import {Link as RouterLink} from 'react-router-dom';

import config from './../../../config';

import logo from './../../../assets/images/logo.png';

const LogoSection = () => {

    return (
        <React.Fragment>
            <Link component={RouterLink} to={config.defaultPath} style={{textDecoration:"none"}}>
                <img src={logo} alt="Decentralized Bank" width="100" /><br/>
            </Link>
        </React.Fragment>
    );
};

export default LogoSection;
