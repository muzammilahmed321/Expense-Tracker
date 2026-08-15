import React from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../api/authservice";


export default function Navbar() {


  const navigate = useNavigate();


  const handleLogout = () => {

    authService.logout();

    navigate("/login");

  };



  const isLoggedIn = authService.isAuthenticated();



  return (

    <nav className="navbar">


      <div className="navbar-brand">

        <Link to="/">
          Expense Tracker
        </Link>

      </div>



      <div className="navbar-links">


        {
          isLoggedIn ? (

            <>


              <Link to="/dashboard">
                Dashboard
              </Link>


              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>


            </>


          ) : (

            <>


              <Link to="/login">
                Login
              </Link>


              <Link to="/register">
                Register
              </Link>


            </>

          )


        }


      </div>


    </nav>

  );

}