import React from 'react'
import axios from "axios";
axios.defaults.withCredentials = true;
const Picked = ({id, Ranks, Song, Artist, SpotRanks, picked, ChangePicked}) => {
  return (
    <div className= 'p-5 border-b-2 text-lg text-wrap bg-blue-100' onClick={() => ChangePicked(id)}>
        <div className = 'font-bold capitalize'>{Song}</div>
        <div>{Artist}</div>
        <div>Spotify: {SpotRanks}</div>
        <div>Billboard: {Ranks}</div>
    </div>
  )
}

export default Picked