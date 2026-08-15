import React from "react";
import { Navigate } from "react-router-dom";
import authService from "../api/authservice";


function PrivateRoute({ children }) {


    const loggedIn = authService.isAuthenticated();



    return loggedIn ? (

        <>

            {children}

        </>

    ) : (

        <Navigate to="/login" replace />

    );


}


export default PrivateRoute;