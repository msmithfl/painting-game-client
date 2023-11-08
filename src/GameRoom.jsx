import React, { useEffect, useState } from 'react';
import GameCanvas from './GameCanvas';
import paintings from "./paintings.json";

function GameRoom({ roomName, handleScoreSubmit, setGameState }) {
  const [score, setScore] = useState(Math.floor(Math.random() * 100) + 1);
  const [timer, setTimer] = useState(65); // Set the initial countdown time in seconds
  const [selectedPainting, _] = useState(Object.values(paintings)[Math.floor(Math.random() * 2)]); // Store the selected painting

  useEffect(() => {
    // Start the countdown when the component mounts
    const countdownInterval = setInterval(() => {
      // Decrement the timer by 1 second
      setTimer((prevTimer) => prevTimer - 1);

      // Check if the timer has reached 1
      if (timer === 1) {
        handleScoreSubmit(score);
        const delayMilliseconds = 500;

        setTimeout(() => {
          setGameState('postgame');
        }, delayMilliseconds);
        
        // Clear the interval to stop the countdown
        clearInterval(countdownInterval);
      }
    }, 1000); // Update the timer every 1 second

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(countdownInterval);
    };
  }, [handleScoreSubmit, timer]);

  return (
    <div className='flex flex-col' style={{ touchAction: 'none' }}>
      <div className='m-1'>
        <h2 className='font-bold text-left'>Gameroom: {roomName}</h2>
      </div>
      <div className='flex flex-col items-center'>
        <p className='pb-1'>Time left: {timer > 60 ? 60 : timer} seconds</p>
        <GameCanvas selectedPainting={selectedPainting} />
      </div>
    </div>
  );
};

export default GameRoom;
