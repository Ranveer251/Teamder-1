import React, { useEffect, useState } from 'react';
import ChatColumn from './ChatColumn';
import Chat from './Chat';
import './Chat.css';

import axios from 'axios';
import querystring from 'querystring';

import SERVER_URL from '../../utils/constants';

import io from 'socket.io-client';

axios.defaults.withCredentials = true;

function ChatPage(){
    const [chats, setChats] = useState([]);
    const [load, setLoad] = useState(false);

    const [currChat, setCurrChat] = useState({});

    const [socket, setSocket] = useState();

    const [typing, setTyping] = useState("");

    const [chatView, setChatView] = useState(false);

    const username = localStorage.getItem("username");

    useEffect(() => {

        const newSocket = io("http://localhost:5000", { query: { username } });

        setSocket(newSocket);

        return () => newSocket.close();
    }, [username])

    async function getChats() {
        const res = await axios.get(`${SERVER_URL}/getchats`);
        const data = res.data;
        setChats(data);
        setLoad(true);
    }

    function changeCurrChat(userChat) {
        for (var i = 0; i < chats.length; i++) {
            if (chats[i].user === userChat) {
                setCurrChat(chats[i]);
                break;
            }
        }
        setChatView(true);
    }

    useEffect(async () => {
        await getChats();
        // sortChats();
        // setCurrChat(chats[0]);
    }, [])

    // useEffect(async ()=>{
    //     // await setChats((prev) => {
    //     //     return prev.sort((a,b)=>a.ts>=b.ts?-1:1)
    //     // })
    //     let temporaryarray = chats.slice();
    //     temporaryarray = temporaryarray.sort((a,b)=>a.ts>=b.ts?-1:1)
    //     // temporaryarray[index]['messages'] = [...temporaryarray[index]['messages'],{source:source, message:message}];
    //     // temporaryarray[index]['ts'] = ts;
    //     setChats(temporaryarray);    
    // },[chats])
    function sortChats(){
        let temporaryarray = chats.slice();
        temporaryarray = temporaryarray.sort((a,b)=>a.ts>=b.ts?-1:1)
        // temporaryarray[index]['messages'] = [...temporaryarray[index]['messages'],{source:source, message:message}];
        // temporaryarray[index]['ts'] = ts;
        setChats(temporaryarray);   
    }
    
    useEffect(()=>{
        if(socket == null)  return;


        socket.on('receive-message', async ({source,message,ts}) => {
            setTyping("");

            let index = chats.findIndex(x=> x.user === source); 
     
            if (index !== -1){
                let temporaryarray = chats.slice();
                temporaryarray[index]['messages'] = [...temporaryarray[index]['messages'],{source:source, message:message}];
                temporaryarray[index]['ts'] = ts;
                setChats(temporaryarray);
            }
            else {
                // console.log('no match');
                // // setChats((prev)=>([...prev, {source:source, messages:[], ts: new Date().getTime()}]));
                // let temporaryarray = [...chats, {source:source, messages:[{source:source, message:message}], ts: new Date().getTime()}];
                // // temporaryarray.push({source:source, messages:[{source:source, message:message}], ts: new Date().getTime()});
                // // temporaryarray[index]['messages'] = [...temporaryarray[index]['messages'],{source:source, message:message}];
                // // temporaryarray[index]['ts'] = ts;
                // setChats(temporaryarray);
                getChats();
            }
            // changeCurrChat(source);
            sortChats();
        });
        return ()=>socket.off('receive-message');
    },[socket, chats])

    useEffect(()=>{
        if(socket == null) return;

        socket.on('typing-received',({source, typed}) => {
            setTyping(source);
            if(typed === '')
            {
                setTyping("");
            }
        })
        return ()=>socket.off('typing-received');
    },[socket])


    return load ? (
        <div className="chat-page">
            <ChatColumn chatView={chatView} typing={typing} chats={chats} changeCurrChat={changeCurrChat} />
            <Chat
                typing = {currChat.user === typing}
                socket={socket}
                chats={chats}
                setCurrChat={setCurrChat}
                currChat={typeof currChat.user === 'undefined' ? { user: "No user Selected", messages: [] } : currChat}
                chatView={chatView} 
                setChatView={setChatView}/>
        </div>
    ) : "Loading"
}

export default ChatPage;