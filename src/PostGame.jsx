import React, { useEffect, useState } from 'react';
import paintings from "./paintings.json";

function PostGame({ socket, roomName, setGameState, handlePlayerReady, handleGetRandNum, randomValue }) {
  const [finalUsers, setFinalUsers] = useState([]);
  const [countdown, setCountdown] = useState(10); // Initial countdown time in seconds
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
        // When the countdown reaches 0, send to lobby and set isPlayerReady to false
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
      <div className='flex flex-col items-center'>
        <img
          src={selectedPainting.path}
          style={{ width: '200px' }}
        />
        <p className="text-xs">{selectedPainting.artist}, <i>{selectedPainting.title}</i> - {selectedPainting.year}</p>
      </div>
      <div>
        <h2 className='text-xl mt-5'>Postgame: {roomName}</h2>
        <p className='text-center'>Countdown: {countdown} seconds</p>
      </div>
      <div className='flex'>
        <ul className='sm:grid sm:grid-cols-2 gap-7 mt-5'>
          {finalUsers.map((user) => (
            <li className='text-center mt-5 sm:mt-0' key={user.id}>
              <p className={`${socket.id === user.id ? 'font-bold' : ''}`}>
                {user.userName}
                {socket.id === user.id && <span> (You)</span>}
              </p>
              <img className='mx-auto' width={150} src={user.playerIcon}/>
              <p>{user.score}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostGame;
