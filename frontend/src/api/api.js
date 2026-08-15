const API_URL = "http://127.0.0.1:8000/api";



export const getHeaders = () => {

    const token = localStorage.getItem("access");


    return {

        "Content-Type": "application/json",

        ...(token && {

            Authorization: `Bearer ${token}`

        })

    };

};



export default API_URL;