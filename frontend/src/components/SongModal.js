import { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import {ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis} from 'recharts';
axios.defaults.withCredentials = true;
const SongModal = ({id, spotRank, billRank, closeModal}) => {

    const [details, setDetails] = useState({})

    useEffect(() => {
        fetch(`http://localhost:8080/query/songChars?s1=${id}`
        ).then(res => res.json()).then(resJson => {
            setDetails(resJson[0])})

    }, [id])


  return (
    <div className = "w-[100%] h-[100%] overflow-y-scroll fixed backdrop-blur-sm inset-0  bg-black bg-opacity-50 z-[1000]">
        <div className = "bg-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-3xl fixed p-10">
        <div className=" text-left ">
        <CloseIcon
          className="cursor-pointer scale-120"
          onClick={() => closeModal(false)}
        />       </div>

        <div className = "flex justify-center items-center flex-col gap-3" > 
            <div>{details.Song}</div>
            {details.Image_URL && <img src={details.Image_URL} width={"200px"}/>}
            
            { details.Speechiness && <div> <div>Loudness: {details.Loudness}</div>
            <div>Speechiness: {details.Speechiness}</div>
            <div>Energy: {details.Energy}</div>
            <div>Valence: {details.Valence}</div>
            <div>Acousticness: {details.Acousticness}</div>
            <div>Instrumentalness: {details.Instrumentalness}</div> </div>}
            {details.Song_URL && <div className = "text-blue-400 underline"> <a href = {details.Song_URL}> Play Song on Spotify </a></div>}
            {details.ArtistDetails &&
                JSON.parse(details.ArtistDetails).map((inp) => (
                    <div>
                    <div> Artist: {inp[0]} </div>
                    <div> Nationality: {inp[1]} </div>
                    <div> Continent: {inp[2]} </div>

                    </div>

                ))
            }







        </div>



            </div>
    </div>
  )
}

export default SongModal