
import React, {  useState, useEffect } from 'react'

import AppNavigation from './app-navigations';
import AuthNavigation from './auth-navigations';

import { db, auth } from '../components/firebase'
//context api

const Navigations = () => {

    // const [user, setUser] = useState();
    const [isAuthenticated, setIsAuthenticated ] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if(user){
                // const [isAuthenticated ] = useState(true);
                // setIsAuthenticated(false)
                setIsAuthenticated(true)
            }else{
                setIsAuthenticated(false)
            }
        })
    })

    
    
    // const [isAuthenticated ] = useState(true);

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