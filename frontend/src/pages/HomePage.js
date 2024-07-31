import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../HomePage.css'; 
import axios from "axios";
axios.defaults.withCredentials = true;
function HomePage() {
    const navigate = useNavigate();

    console.log("HomePage rendering"); 

    return (
        <div className="homepage">
            <header className="header">
                <h1>Welcome to the Music History Simulator!</h1>
            </header>
            <main className="content">
                <section className="introduction">
                    <p>Test your knowledge of music history and your ability to predict hits! Participate by selecting what you believe were the top songs from 2017 to 2023, every six months. Points are awarded based on actual performances in the Billboard’s Hot 100 and Spotify’s Global 200 charts.</p>
                </section>
                <div className = "flex flex-row gap-10">
                    <div onClick = {() => navigate('/signup')} className="start-button flex-1">
                        Sign Up
                    </div>
                    <div onClick = {() => navigate('/signin')} className="start-button flex-1">
                        Log In 
                    </div>
                </div>
            </main>
        </div>
    );
}

export default HomePage;
