import React from 'react'
import { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import axios from "axios";
axios.defaults.withCredentials = true;
const Leaderboard = () => {

    const[leader, setLeader] = useState([])

    useEffect(() => {
      fetch(`http://localhost:8080/getScore`
    ).then(res => res.json()).then(resJson => {setLeader(resJson)})

    })
  return (
    <div>
      <NavBar />
    <div className = "mt-10">
        <div className = "text-center text-3xl uppercase tracking-widest">Leaderboard</div>
        <div className = "flex flex-col justify-center items-center">
        {
            leader.map((inp, index) => (
                <div className = "p-3 text-lg"> 
                #{index + 1}&nbsp;&nbsp;&nbsp;{inp.username}&nbsp;&nbsp;&nbsp;{inp.score}
                </div>
            ))
        }
        </div>
    
    </div>
    </div>
  )
}

export default Leaderboard