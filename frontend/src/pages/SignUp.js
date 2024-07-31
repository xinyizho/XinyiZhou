import React from 'react'
import Access from '../components/Access';
import axios from "axios";
axios.defaults.withCredentials = true;


const SignUp = () => {
  return (<div>
    <Access route={"register"} header={"Sign Up"} subtext={"log in to an existing account"} link={"signin"} buttonText={"Sign Up"} PasswordLabel={"Password"}/>
      </div>)
  
}

export default SignUp