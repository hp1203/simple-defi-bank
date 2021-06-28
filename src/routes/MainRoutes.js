import React, {lazy} from 'react';
import {Route, Switch, useLocation} from 'react-router-dom';

import MainLayout from './../layout/MainLayout';

const DashboardDefault = lazy(() => import('../views/dashboard/Default'));

const MainRoutes = () => {
    const location = useLocation();

    return (
        <Route
            path={[
                '/dashboard',
            ]}
        >
            <MainLayout showBreadcrumb={true}>
                <Switch location={location} key={location.pathname}>
                        <Route path="/dashboard" component={DashboardDefault} />
                        <Route path="/deposit" component={DashboardDefault} />
                        <Route path="/withdraw" component={DashboardDefault} />
                </Switch>
            </MainLayout>
        </Route>
    );
};

export default MainRoutes;
