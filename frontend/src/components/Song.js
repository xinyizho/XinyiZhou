import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useState } from 'react';
import SongModal from './SongModal';
import axios from "axios";
axios.defaults.withCredentials = true;
const Song = ({id, Ranks, Last_week, Peak_Position, Weeks_in_Chart, Song, Artist, Image_URL, SpotRanks, Song_URL, picked, ChangePicked}) => {
    const [openModal, setOpenModal] = useState(false);
    return (
    <div className={`p-5 border-b-2 ${picked.includes(id) ? 'bg-blue-100' : ''}`}  >
        <div className='flex flex-row gap-4' >
            <div className="w-[150px]">
                <div className='text-wrap text-lg font-bold capitalize'>{Song}</div>
                <div className='text-wrap text-lg'>{Artist}</div>
            </div>
            { Ranks && <div>
                <div>
                          Billboard:
                      </div><div>
                              Rank: {Ranks}
                          </div><div>
                              Last Week: {Last_week}
                          </div><div>
                              Peak Position: {Peak_Position}
                          </div><div>
                              Weeks On Chart: {Weeks_in_Chart}
                          </div>
                    

            </div>}
            {SpotRanks &&<div>
                <div>
                    Spotify:
                </div>
                <div>
                    Rank: {SpotRanks}
                </div>
                <div className = "mt-2">
                <a href={Song_URL} className='px-3 py-1 text-white bg-[#1DB954] rounded-lg'>
                    Listen
                </a>
                </div>

            </div>}
            <div className = "flex flex-col justify-center items-center gap-8">

                <div>
                    
                    {picked && picked.includes(id) ?
                    <RemoveCircleOutlineIcon className='scale-[1.5] relative cursor-pointer' onClick={() => ChangePicked(id)}/> :
                    <AddCircleOutlineIcon className='scale-[1.5] relative cursor-pointer' onClick={() => ChangePicked(id)}/>
                }

                
                
                </div>
                                                
                <div className = "bg-red-100 py-3 px-5 rounded-md cursor-pointer" onClick = {() => setOpenModal(true)} >
                    Show More
                </div>
 {openModal && <SongModal id={id} spotRank={SpotRanks} billRank={Ranks} closeModal={setOpenModal}/>}

            </div>
        </div>
    </div>
  )
}

export default Song