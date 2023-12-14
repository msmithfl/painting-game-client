import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getRandomUsername } from './hooks/getRandomUsername.js';
import io from 'socket.io-client';
import Lobby from './Lobby.jsx';
import GameRoom from './GameRoom.jsx';
import PostGame from './PostGame.jsx';

const MainRoom = () => {
  const { roomName } = useParams();
  const location = useLocation();
  const qrCodeURL = `https://painting-game-client.onrender.com${location.pathname}`;
  const [userList, setUserList] = useState([]);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [userName, _] = useState(getRandomUsername());
  const [gameState, setGameState] = useState('lobby');
  const [randomValue, setRandomValue] = useState(0);
  
  const [socket, setSocket] = useState(null);
  
  localStorage.setItem('username', userName);

  // This joins a room (lobby) with the URL parameter roomName (set in previous screen, App.jsx)
  useEffect(() => {
    const newSocket = io('https://painting-game-server.onrender.com'); //http://localhost:3001

    setSocket(newSocket);

    // Join the room
    newSocket.emit('joinRoom', roomName, userName);

    // Update the user list
    newSocket.on('updateUserList', (users) => {
      setUserList(users);
    });

    // set random painting
    handleGetRandNum(newSocket);
  }, []);

  // Checking if all players are ready
  useEffect(() => {
    // check if more than 1 user and all users are ready
    const allUsersReady = userList.length > 1 && userList.every((user) => user.isReady);

    if (allUsersReady) {
      //console.log('All Users Ready!');
      setGameState('gameroom');
    } else {
      //console.log('Waiting for Users...');
    }
  }, [userList]);

  const handlePlayerReady = () => {
    setIsPlayerReady(!isPlayerReady);
    // Emit the 'playerReady' event to the server
    if (socket) {
      socket.emit('playerReady', isPlayerReady);  
    }
  }

  const handleScoreSubmit = (score) => {
    socket.emit('sendScore', score);
  };

  const handleCanvasDataSubmit = (canvasData) => {
    socket.emit('sendCanvasData', canvasData);
  };

  const handleGetRandNum = (socket) => {
    // Generating a random number for coordinating painting choice in GameRoom
    socket.emit('generateNumber', roomName);
      
    // Setting random number in client
    socket.on('receiveNumber', (randomValue) => {
      setRandomValue(randomValue);
    })
  }
  
  //was in main div, min-h-screen 

  return (
    <div className='flex flex-col'>
      {/* <div className='m-1'>
        <h3 className='font-bold text-left'>Playing as: {localStorage.getItem('username')}</h3>
      </div> */}
      <div>
        {gameState === 'lobby' && 
          <div className="flex flex-col items-center" >
            <Lobby
              roomName={roomName}
              userList={userList}
              isPlayerReady={isPlayerReady}
              handlePlayerReady={handlePlayerReady}
              socket={socket}
            />
          </div>
        }
        {gameState === 'gameroom' &&
          <GameRoom 
            roomName={roomName}
            handleScoreSubmit={handleScoreSubmit}
            handleCanvasDataSubmit={handleCanvasDataSubmit}
            setGameState={setGameState}
            randomValue={randomValue}
            socket={socket}
          />
        }
        {gameState === 'postgame' &&
          <PostGame
            socket={socket}
            roomName={roomName}
            setGameState={setGameState}
            handlePlayerReady={handlePlayerReady}
            handleGetRandNum={handleGetRandNum}
            randomValue={randomValue}
          />
        }
      </div>
    </div>
  );
};

export default MainRoom;


///// if needed, put this in main useEffect (socket cleanup)
//    
    // // Cleanup after socket is unmounted
    // return () => {
    //   newSocket.disconnect();
    // };
