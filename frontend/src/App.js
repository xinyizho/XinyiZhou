import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Selection from './pages/Selection';
import Scores from './pages/Scores';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import { useState } from 'react';
import Leaderboard from './pages/Leaderboard';
import ResetPassword from './pages/ResetPassword';

function App() {
  const [score, setScore] = useState(0);
  const[times, setTimes] = useState(1);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/selection/:date" element={<Selection />} />
        <Route path="/scores/:s1/:s2/:s3/:d1" element={<Scores score={score} changeScore={setScore} times={times} setTimes={setTimes} />} />
        <Route path="/signin" element={<LogIn/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/leaderboard" element={<Leaderboard/>} />
        <Route path="/reset-pass" element={<ResetPassword/>} />

      </Routes>
    </Router>
  );
}


export default App;
