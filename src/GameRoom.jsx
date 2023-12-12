import React, { useEffect, useState } from 'react';
import GameCanvas from './GameCanvas';
import paintings from "./paintings.json";

function GameRoom({ roomName, handleScoreSubmit, handleCanvasDataSubmit, setGameState, randomValue, socket }) {
  const [timer, setTimer] = useState(20); // Set the initial countdown time in seconds
  const [selectedPainting, _] = useState(Object.values(paintings)[randomValue]); // Randomly selected painting
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    console.log(randomValue);
    socket.emit('setUsedPaintings', roomName, randomValue);
  }, [])

  useEffect(() => {
    // Start the countdown when the component mounts
    const countdownInterval = setInterval(() => {
      // Decrement the timer by 1 second
      setTimer((prevTimer) => prevTimer - 1);

      // Check if the timer has reached 1
      if (timer === 1) {
        setGameOver(true);
        //handleScoreSubmit(score);
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

  //place in main div to center canvas, 'flex flex-col justify-center items-center h-screen'

  return (
    <div className='flex flex-col justify-center items-center mt-6' style={{ touchAction: 'none' }}>
      {/* <div className='m-1'>
        <h2 className='font-bold text-left'>Gameroom: {roomName}</h2>
      </div> */}
      <div className='flex flex-col items-center'>
        <GameCanvas selectedPainting={selectedPainting} timer={timer} gameOver={gameOver} handleScoreSubmit={handleScoreSubmit} handleCanvasDataSubmit={handleCanvasDataSubmit} />
      </div>
    </div>
  );
};

export default GameRoom;
