import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

import authService from "../api/authservice";



function Register() {


    const navigate = useNavigate();



    const [formdata, setFormdata] = useState({

        username: "",
        email: "",
        password: "",
        confirmPassword: ""

    });



    const [showPassword, setShowPassword] = useState(false);

    const [term, setTerm] = useState(false);

    const [errorMsg, setErrorMsg] = useState("");





    const handleChange = (e) => {


        setFormdata({

            ...formdata,

            [e.target.name]: e.target.value

        });


    };







    const handleSubmit = async (e) => {


        e.preventDefault();



        if (!term) {

            setErrorMsg(
                "Please accept Terms and Conditions"
            );

            return;

        }



        if (formdata.password !== formdata.confirmPassword) {


            setErrorMsg(
                "Passwords do not match"
            );

            return;

        }





        try {


            await authService.register({

                username: formdata.username,

                email: formdata.email,

                password: formdata.password

            });



            navigate("/login");


        }


        catch(error) {


            setErrorMsg(
                error.message || "Registration failed"
            );


        }



    };







    return (


        <div className="auth-container">


            <div className="auth-card">



                <h1>
                    Create Account
                </h1>



                <p className="subtitle">
                    Sign up to get started
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
                        Email
                    </label>


                    <input

                        type="email"

                        name="email"

                        value={formdata.email}

                        onChange={handleChange}

                        placeholder="Enter email"

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

                            placeholder="Create password"

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







                    <label>
                        Confirm Password
                    </label>


                    <input

                        type="password"

                        name="confirmPassword"

                        value={formdata.confirmPassword}

                        onChange={handleChange}

                        placeholder="Confirm password"

                    />







                    <label className="checkbox">


                        <input

                            type="checkbox"

                            checked={term}

                            onChange={() =>
                                setTerm(!term)
                            }

                        />


                        I agree Terms & Conditions


                    </label>






                    <button className="auth-btn">


                        Sign Up


                    </button>




                </form>





                <p className="switch">


                    Already have account?


                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                    >

                        Sign In

                    </button>


                </p>



            </div>


        </div>


    );


}


export default Register;