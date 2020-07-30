import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home';

const Router = () => {
    return(
        <BrowserRouter>
            <Route component={Home} path="/" exact/>
        </BrowserRouter>
    );
}

export default Router