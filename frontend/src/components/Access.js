import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
axios.defaults.withCredentials = true;

const Access = ({route, header, subtext, link, buttonText, PasswordLabel}) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleField = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/${route}`, {
        username,
        password,
      });

      if (response.status === 200) {
        navigate(`/selection/2017-01-01`);
      } else {
        alert(buttonText + " failed.");
      }
    } catch (error) {
      console.log(error);
      alert(buttonText + " failed.");
    }
  };

  const goto = () => {
    navigate("/" + link);
  };

  return (
    <div className="text-center mt-24">
    <h2 class="text-4xl tracking-tight">
         {header}
      </h2>
      <span class="text-sm mt-2 capitalize text-blue-500 cursor-pointer" onClick={() => goto()}> 
         {subtext}
      </span>
      <div class="flex justify-center my-2 mx-4 md:mx-0">
        <form class="w-full max-w-xl bg-white rounded-lg shadow-md p-6">
            <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full md:w-full px-3 mb-6">
                  <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" > Username</label>
                  <input class="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none" 
                  type='username'
                  onChange={(e) => setUsername(e.target.value)}

                    required/>
              </div>
                <div class="w-full md:w-full px-3 mb-6">
                  <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for='Password'> {PasswordLabel}</label>
                  <input class="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none"
                   type='password'
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
              </div>
              <div className="w-full flex justify-center">
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-indigo-500 outline-none font-bold text-white uppercase"
              onClick={handleField}
            >
              {buttonText}
            </button>
          </div>
        </form>

        </div>
      </div>
  )
}

export default Access