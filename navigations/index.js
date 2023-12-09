
import React, {  useState } from 'react'

import AppNavigation from './app-navigations';
import AuthNavigation from './auth-navigations';
//context api

const Navigations = () => {
    const [isAuthenticated ] = useState(true);

    if (isAuthenticated) {
        return (

                    <AppNavigation />

        )
    } else {
        return (

                <AuthNavigation/>

        )
    }

}

export default Navigations