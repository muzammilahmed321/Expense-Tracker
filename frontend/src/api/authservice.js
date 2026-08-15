import API_URL from "./api";


class AuthService {


  async register(userData) {

    const response = await fetch(
      `${API_URL}/auth/register/`,
      {
        method:"POST",

        headers:{
          "Content-Type":"application/json",
        },

        body:JSON.stringify(userData),
      }
    );


    const data = await response.json();


    if(!response.ok){

      throw new Error(
        data.detail || "Registration failed"
      );

    }


    return data;

  }





  async login(credentials){


    const response = await fetch(
      `${API_URL}/auth/login/`,
      {
        method:"POST",

        headers:{
          "Content-Type":"application/json",
        },

        body:JSON.stringify(credentials),
      }
    );


    const data = await response.json();



    if(!response.ok){

      throw new Error(
        data.detail || "Login failed"
      );

    }



    localStorage.setItem(
      "access",
      data.access
    );


    localStorage.setItem(
      "refresh",
      data.refresh
    );


    return data;

  }





  logout(){

    localStorage.removeItem("access");

    localStorage.removeItem("refresh");

  }




  getAccessToken(){

    return localStorage.getItem("access");

  }




  isAuthenticated(){

    return Boolean(
      localStorage.getItem("access")
    );

  }


}


export default new AuthService();