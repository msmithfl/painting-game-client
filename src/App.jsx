import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import QRCode from 'react-qr-code';

const App = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState(null);

  // This navigates the user to a gameroom with the random name created in the createRoom() function
  useEffect(() => {
    if (roomName) {
      navigate(`/gameroom/${roomName}`);
    }
  }, [roomName]);

  // This function creates a room name with four random variables, adverb, adjective, museum name and a random 3 digit number
  const createRoom = () => {
    const adverbs = ['Very', 'Nearly', 'Insanely', 'Amazingly'];
    const adjectives = ['Empty', 'Slippery', 'Brilliant', 'Dreamy'];
    const museumNames = ['MoMA', 'Louvre', 'PAMM', 'Guggenheim', 'Tate'];
  
    const randomAdverb = adverbs[Math.floor(Math.random() * adverbs.length)];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomName = museumNames[Math.floor(Math.random() * museumNames.length)];

    const randomNumber = Math.floor(Math.random() * (999 - 100 + 1)) + 100;

    const uniqueRoomName = `${randomAdverb}_${randomAdjective}_${randomName}_${randomNumber}`;

    setRoomName(uniqueRoomName);
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <div className="flex flex-col items-center">
        {/* <QRCode className="w-1/3 h-1/3 pb-5"  value='https://painting-game-client.onrender.com/' /> */}
        <h1 className='text-5xl text-center'>PAMM Painting Game</h1>
      </div>
      <div className='flex flex-col mt-8 space-y-3 text-xl'>
        <button onClick={createRoom}>Create a Game Room</button>
        <button>Play Solo</button>
      </div>
      <Footer/>
    </div>
  );
};

export default App;
