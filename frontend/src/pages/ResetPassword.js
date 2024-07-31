import React from 'react'
import Access from '../components/Access'
import NavBar from '../components/NavBar'
import axios from "axios";
axios.defaults.withCredentials = true;
const ResetPassword = () => {
  return (
    <div>
    <NavBar />
    <Access route={"reset-password"} header={"Reset Password"} subtext={"play game"} link={"selection/2017-01-01"} buttonText={"Update Password"} PasswordLabel={"New Password"} />
    </div>
  )
}

export default ResetPassword