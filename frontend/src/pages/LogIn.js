import React from 'react'
import Access from '../components/Access';
import axios from "axios";
axios.defaults.withCredentials = true;

const LogIn = () => {
  return (<div>
    <Access route={"login"} header={"Sign In"} subtext={"register a new account"} link={"signup"} buttonText={"Log in"} PasswordLabel={"Password"} />
      </div>)
  
}

export default LogIn