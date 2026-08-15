import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

import authService from "../api/authservice";


function Login() {


    const navigate = useNavigate();


    const [formdata, setFormdata] = useState({

        username: "",
        password: ""

    });


    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");



    const handleChange = (e) => {

        setFormdata({

            ...formdata,

            [e.target.name]: e.target.value

        });

    };





    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!formdata.username || !formdata.password) {

            setErrorMsg("Please fill all fields");
            return;

        }



        setLoading(true);
        setErrorMsg("");



        try {


            const data = await authService.login(formdata);



            localStorage.setItem(
                "username",
                data.username || formdata.username
            );



            if (rememberMe) {

                localStorage.setItem(
                    "rememberMe",
                    "true"
                );

            }



            navigate("/dashboard");


        }

        catch (error) {


            setErrorMsg(
                error.message || "Invalid credentials"
            );


        }

        finally {

            setLoading(false);

        }


    };





    return (

        <div className="auth-container">

            <div className="auth-card">


                <h1>
                    Welcome Back
                </h1>


                <p className="subtitle">
                    Sign in to your account
                </p>




                {
                    errorMsg &&

                    <p className="error-message">
                        {errorMsg}
                    </p>

                }



                <form onSubmit={handleSubmit}>


                    <label>
                        Username
                    </label>


                    <input

                        name="username"

                        value={formdata.username}

                        onChange={handleChange}

                        placeholder="Enter username"

                    />




                    <label>
                        Password
                    </label>


                    <div className="password-box">


                        <input

                            type={
                                showPassword
                                    ?
                                    "text"
                                    :
                                    "password"
                            }

                            name="password"

                            value={formdata.password}

                            onChange={handleChange}

                            placeholder="Enter password"

                        />



                        <button

                            type="button"

                            onClick={() =>
                                setShowPassword(!showPassword)
                            }

                        >

                            {
                                showPassword
                                    ?
                                    "Hide"
                                    :
                                    "Show"
                            }

                        </button>


                    </div>





                    <div className="options">


                        <label className="checkbox">


                            <input

                                type="checkbox"

                                checked={rememberMe}

                                onChange={() =>
                                    setRememberMe(!rememberMe)
                                }

                            />


                            Remember Me


                        </label>


                        <button
                            type="button"
                            className="forgot"
                        >

                            Forgot Password?

                        </button>


                    </div>




                    <button

                        className="auth-btn"

                        disabled={loading}

                    >

                        {
                            loading
                                ?
                                "Signing In..."
                                :
                                "Sign In"
                        }


                    </button>



                </form>




                <p className="switch">

                    Don't have an account?


                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                    >

                        Sign Up

                    </button>


                </p>



            </div>

        </div>

    );

}


export default Login;