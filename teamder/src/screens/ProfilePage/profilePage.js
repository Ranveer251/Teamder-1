import React, { useEffect, useState } from 'react';
import ProjectCards from '../../components/ProjectCards/ProjectCards';
import NameAndAvatar from '../../components/NameAndAvatar';
import TechStack from '../../components/TechStack';
import Menu from '../../components/Menu';
import {Typography} from '@material-ui/core';

// import {GitHubIcon, FacebookIcon, TwitterIcon, LinkedInIcon} from '@material-ui/icons';
import FacebookIcon from '@material-ui/icons/Facebook';
import GitHubIcon from '@material-ui/icons/GitHub';
import TwitterIcon from '@material-ui/icons/Twitter';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import axios from 'axios';

import querystring from 'querystring';

import '../../components/Profile.css'

//temporary json file(s)      (should be removed later)
import projectcard from '../../exampleJSONs/projectcard.json'

// import userDataContext from '../../components/user-context';

axios.defaults.withCredentials = true;

const userDataContext = React.createContext([{}, ()=>{}]);

function ProfilePage(props){

    console.log(localStorage.getItem('username'));
    const username = localStorage.getItem('username');
    console.log(props.routerProps.match.params.username);


    const [data, setData] = useState({});
    useEffect(()=>{
        axios.post("http://localhost:5000/getuserdata", querystring.stringify({username: props.routerProps.match.params.username}), {
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        credentials: 'include',
        withCredentials: true
      })
      .then(res => res.data)
    .then(data => {
        setData(data);
    })
    
    },[])

    useEffect(()=>{
            console.log(data);
          axios.post("http://localhost:5000/profile/edit", querystring.stringify(data), {
            headers: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            credentials: 'include',
            withCredentials: true
          })
          .then(res => {
            if(res.status === 200)
            {
              console.log("updated");
            }
          });
          
      }, [data])

    console.log(data);

    // const id = props.routerProps.match.params.id;
    // console.log(id);
    return(
        <userDataContext.Provider value={[data, setData]}>
        <div className="fullpage" style={{display:"flex", flexDirection:"column", flexWrap:"wrap"}}>
            <div className="topsection" style={{display:"flex", flexDirection:"row"}}>
                <div className="name-avatar-container"><NameAndAvatar myname={data.name || "Your Name"} style={{minWidth:"300px"}} className="NaA"  src="" name="Random User"/></div>
                    <div className="bio-container">
                        <Typography style={{height: "50%", width: "50%"}} className="bio">{data.description}</Typography>
                        <div className="social-icons"><FacebookIcon /><GitHubIcon /><TwitterIcon /><LinkedInIcon /></div>
                    </div>
            </div>
            <div className="bottomsection" style={{display:"flex", flexDirection:"row", flexWrap:"wrap", justifyContent:"space-between"}}>    
                <div className="menu-container"><Menu className="menu"/></div>
                <div className="content-container">
                    <div style={{display:"flex", flexDirection:"column", flexWrap:"wrap", minWidth:"60vw"}}>
                        <TechStack className="stack" tags={data.techStack || []}/>
                        <ProjectCards className="projects" deets={data.project || []}/>
                    </div>
                </div>
                
            </div>
        </div>
        </userDataContext.Provider>
    );
}

export default ProfilePage ;
export {userDataContext};