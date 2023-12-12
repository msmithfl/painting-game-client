import React, { useEffect, useRef, useState } from 'react';
import paintings from "./paintings.json";
import Footer from './Footer';

function PostGame({ socket, roomName, setGameState, handlePlayerReady, handleGetRandNum, randomValue }) {
  const [finalUsers, setFinalUsers] = useState([]);
  const [countdown, setCountdown] = useState(20); // Countdown time in seconds
  const [selectedPainting, _] = useState(Object.values(paintings)[randomValue]);

  const handleGetUsers = () => {
    socket.emit('getUsers', roomName);

    socket.on('returnUsers', (userList) => {
      setFinalUsers(userList);
    });
  };

  useEffect(() => {
    handleGetUsers();

    // Use setInterval to update the countdown every second
    const timer = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else {
        // When the countdown reaches 0, send to lobby and set isPlayerReady to false, generate new number for next painting
        clearInterval(timer); // Stop the countdown timer
        setGameState('lobby');
        handlePlayerReady();
        handleGetRandNum(socket);
      }
    }, 1000); // Update the countdown every second

    return () => {
      // Clear the countdown timer when the component unmounts to avoid memory leaks
      clearInterval(timer);
    };
  }, [roomName, countdown]);

  return (
    <div className='flex flex-col items-center'>
      <div className='flex flex-col items-center pt-5'>
        <img
          src={selectedPainting.path}
          style={{ width: '200px' }}
        />
        <p className="text-xs">{selectedPainting.artist}, <i>{selectedPainting.title}</i> - {selectedPainting.year}</p>
        <p className='text-xl text-center mt-3'>Countdown: {countdown} seconds</p>
      </div>
      <div className='flex'>
        <ul className='sm:grid sm:grid-cols-2 gap-7 mt-5'>
          {finalUsers.map((user) => (
            <li className='text-center mt-5 sm:mt-0' key={user.id}>
              <p className={`pb-2 ${socket.id === user.id ? 'font-bold' : ''}`}>
                {user.userName}
                {socket.id === user.id && <span> (You)</span>}
              </p>
              <div className='flex'>
                <img className={`select-none mx-auto border-black border-4 rounded-xl ${socket.id === user.id ? 'bg-pink-600' : 'bg-stone-700'}`} width={150} src={user.playerIcon}/>
                {/* <canvas className='bg-white' width={100}></canvas> */}
              </div>
              <p className='pt-2'>{user.score}%</p>
              {/* <p className='pt-2'>{user.canvasData[0]}</p> */}
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default PostGame;
