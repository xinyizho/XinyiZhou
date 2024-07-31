import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Song from '../components/Song'
import Picked from '../components/Picked'
import NavBar from '../components/NavBar';
import axios from "axios";
axios.defaults.withCredentials = true;
const Selection = () => {

    const {date} = useParams();

    const[songs, setSong] = useState([])
    const[picked, setPicked] = useState([])
    const[pickedData, setPickedData] = useState([])
    const[order, setOrder] = useState([])

    const navigate = useNavigate();



    useEffect(() => {
        var d = new Date(date)
        d.setDate(d.getDate() + 8)
        const dString = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
        fetch(`http://localhost:8080/query/songs1?x=${date}&y=${dString}`
        ).then(res => res.json()).then(resJson => {
            setSong(resJson)})

    }, [date])

    const changeSong = (s) => {

        if(picked.includes(s)){
            setPicked(prevSong => [...prevSong].filter(item => item !== s))
            setPickedData(prevSongs => [...prevSongs].filter(item => item.id != s));

        } else if(picked.length < 3){
            setPicked(prevSongs => [...prevSongs, s]);
            for (var i = 0; i < songs.length; i++) {
                if (songs[i].id === s) {
                    setPickedData(prevSongs => [...prevSongs, songs[i]]);
                    break
                }
        }
    }
}

const toScore = () => {
    if(picked.length === 3){
        navigate(`/scores/${picked[0]}/${picked[1]}/${picked[2]}/${date}`)
    }
}

const changeOrder = (newOrder) => {
    if(newOrder === "Billboard"){
        setSong(prevSong => [...prevSong].sort((a,b) => (a.Ranks ?? 200) - (b.Ranks ?? 200)))
        setOrder("Billboard")
    } else if(newOrder === "Spotify"){
        console.log(songs)
        setSong(prevSong => [...prevSong].sort((a,b) => (a.SpotRanks ?? 200) - (b.SpotRanks ?? 200)))
        console.log(songs)
        setOrder("Spotify")
    } 
}
    


  return (
    <div>
    <NavBar />

    <div className='flex flex-row w-[100%] gap-10'>
        <div>
            <div>Sort by:</div>
            <div>
                <div className = "flex flex-row p-5 gap-2 items-center">
                    <div className = {` relative h-[20px] w-[20px] rounded-full border-black border ${order === "Billboard" ? 'bg-blue-500' : "bg-white"}`} onClick={() => changeOrder("Billboard")}/>
                    <div>Billboard</div>
                </div>
                <div  className = "flex flex-row p-5 gap-2 items-center">
                    <div className = {`relative h-[20px] w-[20px] rounded-full border-black border ${order === "Spotify" ? 'bg-blue-500' : "bg-white"}`} onClick={() => changeOrder("Spotify")}/>
                    <div>Spotify</div>
                </div>
            </div>
            <div>{date}</div>
        </div>
        <div className = 'flex-1'>
        {
            songs.map((inp) => (
                <Song id={inp.id} Ranks={inp.Ranks} Last_week={inp.Last_Week} Peak_Position={inp.Peak_Position} Weeks_in_Chart={inp.Weeks_in_Chart} Song={inp.Song} Artist={inp.Artist} Image_URL={inp.Image_URL} SpotRanks={inp.SpotRanks} Song_URL={inp.Song_URL} picked={picked} ChangePicked={changeSong} />
            ))

        }
        </div>
    
        <div className='flex-[0.5]'>
        <div className='fixed '>
            {
                pickedData.map((inp) => (
                    <Picked id={inp.id} Ranks={inp.Ranks} Song={inp.Song} Artist={inp.Artist} SpotRanks={inp.SpotRanks} picked={picked} ChangePicked={changeSong} />
                ))
            }
            <div className='mt-[40] py-5 px-10 text-xl font-bold bg-blue-600 text-white cursor-pointer' onClick={toScore}>
                Submit Songs!

            </div>
        </div>
        </div>
    </div>
    </div>
  )
}

export default Selection