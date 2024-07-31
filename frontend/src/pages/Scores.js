import { useEffect, useState } from "react"
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import Chart from "../components/Chart";
import axios from "axios";
import NavBar from "../components/NavBar";
axios.defaults.withCredentials = true;
const Scores = ({score, changeScore, times, setTimes}) => {
    const {s1, s2, s3, d1} = useParams();
    const [scores, setScores] = useState([]);
    const [d2, setD2] = useState('')
    const [top10, setTop10] = useState([])
    const [charts, setCharts] = useState({})
    const navigate = useNavigate();
    const [songs, setSongs] = useState('')


    useEffect(() => {
        console.log(d1)
        var d = new Date(d1)
        d.setMonth(d.getMonth() + 6)
        const dString = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
        setD2(dString)
        console.log(dString, d1)
        fetch(`http://localhost:8080/query/songs2?s1=${s1}&s2=${s2}&s3=${s3}&d1=${d1}&d2=${dString}`
        ).then(res => res.json()).then(resJson => 
            {setScores(resJson)
            changeScore(score + resJson.reduce((accumulator, currentValue) => accumulator + currentValue.R, 0))
            })

        fetch(`http://localhost:8080/query/top10?d1=${d1}&d2=${dString}`
        ).then(res => res.json()).then(resJson => {setTop10(resJson)})


        fetch(`http://localhost:8080/query/indChart?s1=${s1}&s2=${s2}&s3=${s3}&d1=${d1}&d2=${dString}`
        ).then(res => res.json()).then(resJson => {
            setSongs([resJson[1][0].Song, resJson[2][0].Song, resJson[3][0].Song ])
            setCharts(resJson)})
    }, [])

    const changeFunc = async() => {
        if(times === 10){
            try{
            const response = await axios.post(`http://localhost:8080/userScore`, {
            score: score
          });

            } catch(error){
                console.log(error)
            }
            
            navigate(`/leaderboard`)


        } else {
            setTimes(times + 1)
            navigate(`/selection/${d2}`)
        }
    }
  return (
    <div>
    <NavBar />

    <div className = 'flex text-center'>
        <div>
        <div className = "tex-center text-lg">
            Your Performance!
            <Chart data={scores} width={800} height={400} xKey="week" yKey="R"  />
        
    </div>
    <div>
        <div className = "flex flex-row">
        <div className = "text-center">
            {songs[0]}
        <Chart data={charts[1]} width={250} height={175} xKey="week" yKey="Score"  />
        </div>
        <div className = "text-center">
        {songs[1]}

        <Chart data={charts[2]} width={250} height={175} xKey="week" yKey="Score"  />
        </div>
        <div className = "text-center">
        {songs[2]}

        <Chart data={charts[3]} width={250} height={175} xKey="week" yKey="Score"  />        
        </div>
        </div>
    </div>
    <div className='mt-[40] py-5 px-10 text-xl font-bold bg-blue-600 text-white cursor-pointer inline-block rounded-lg' onClick={() => changeFunc() }>
                Change Songs!

            </div>
            </div>
            <div>
                Top 10
                {
                    top10.map((inp, index) => (
                        <div className = {`p-3 capitalize ${inp.id === parseInt(s1)  || inp.id === parseInt(s2) || inp.id === parseInt(s3) ? 'bg-blue-200' : 'bg-white'}`}> #{index + 1} {inp.Song} {inp.Artist} {inp.Score} </div>
                    ))
                }
            </div>
            <div className = "flex flex-col">
            <div>
                Your score: {score}
            </div>
            <div>
                Times: {times} 
            </div>
            <div>
            Remaining: {10 - times}
            </div>
            </div>

        </div>
        </div>
  )
}

export default Scores