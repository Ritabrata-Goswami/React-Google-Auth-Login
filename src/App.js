import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';


function App() {

  const [ user, setUser ] = useState([]);
  // const [ profile, setProfile ] = useState([]);
  const [profileId,setProfileId] = useState(localStorage.getItem("Id") || "");
  const [profileName,setProfileName] = useState(localStorage.getItem("Name") || "");
  const [profileEmail,setProfileEmail] = useState(localStorage.getItem("Email") || "");
  const [profilePic,setProfilePic] = useState(localStorage.getItem("Pic") || "");

  const login = useGoogleLogin({
      onSuccess: (codeResponse) => setUser(codeResponse),
      onError: (error) => console.log('Login Failed:', error)
  });


  useEffect(
    () => {
        if (user) {
            axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                }).then((res) => {
                    // setProfile(res.data);
                    console.log(res.data);
                    setProfileId(res.data.id);
                    setProfileName(res.data.name);
                    setProfileEmail(res.data.email);
                    setProfilePic(res.data.picture);
                    localStorage.setItem("Id",res.data.id);
                    localStorage.setItem("Name",res.data.name);
                    localStorage.setItem("Email",res.data.email);
                    localStorage.setItem("Pic",res.data.picture);
                }).catch((err) => {
                  console.log(err)
                });
        }
    },
    [ user ]
  );

  const logOut = () => {
    googleLogout();
    // setProfile(null);
    localStorage.removeItem("Id");
    localStorage.removeItem("Name");
    localStorage.removeItem("Email");
    localStorage.removeItem("Pic");
    
    window.location.reload();
  };


  return (
    <div class="google-login-container">
      <h2>React Google Login</h2>
            <br />
            <br />
            {profileEmail ? (
                <div>
                    <img src={profilePic} alt="user image" class="profile-img"/>
                    <h3>User Logged in</h3>
                    <p><span class="tag-line">Name:</span> <span class="profile-info">{profileName}</span></p>
                    <p><span class="tag-line">Email Address:</span> <span class="profile-info">{profileEmail}</span></p>
                    <p><span class="tag-line">Profile Id:</span> <span class="profile-info">{profileId}</span></p>
                    <br />
                    <br />
                    <button onClick={logOut} class="logout-btn">Log out</button>
                </div>
            ) : (
                <button onClick={() => login()}>Sign in with Google 🚀 </button>
            )}
    </div>
  );
}

export default App;
