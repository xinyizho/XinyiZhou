import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios";
axios.defaults.withCredentials = true;
const NavBar = () => {
    const navigate = useNavigate();
    const logOut = () => {
        try{
            fetch(`http://localhost:8080/logout`)
        } catch(error) {
            console.log(error)
        }
        navigate("/")
    }
    const deleteAccount = async() => {
        try{
            axios.post(`http://localhost:8080/delete-user`)
        } catch(error) {
            console.log(error)
        }
        navigate("/")
    }

  return (
    <div className = 'flex-row flex bg-blue-100 gap-12 p-3'>
        <div className = "cursor-pointer" onClick={() => navigate('/selection/2017-01-01')}> Game </div>
        <div className = "cursor-pointer" onClick={() => navigate('/leaderboard')}> Leaderboard </div>
        <div className = "cursor-pointer" onClick={() => logOut()}> Logout </div>
        <div className = "cursor-pointer" onClick={() => navigate('/reset-pass')}> Reset Password </div>
        <div className = "cursor-pointer" onClick={() => deleteAccount()}> Delete Account </div>

    </div>
  )
}

export default NavBar