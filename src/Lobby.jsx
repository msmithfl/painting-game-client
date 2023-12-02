import React from 'react';
import QRCode from 'react-qr-code';
import Footer from './Footer';

function Lobby({roomName, userList, isPlayerReady, handlePlayerReady, socket}) {
  const qrCodeURL = `https://painting-game-client.onrender.com${location.pathname}`;

  return (
    <div className='flex flex-col items-center'>
      <div className='flex flex-col items-center'>
        <h2 className='text-xl mt-5'>Lobby: {roomName}</h2>
        <QRCode className='pt-5' value={qrCodeURL} />
        <h1 className='text-2xl font-bold pt-5'>Tap <span className='text-pink-600'>Your Icon</span> When Ready!</h1>
      </div>
      <div className='flex'>
        <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-2'>
          {userList.map((user) => (
            <li className='select-none text-center mt-5 sm:mt-0' key={user.id}>
              <p className={`pb-2 ${socket.id === user.id ? 'font-bold' : ''}`}>
                {user.userName}
                {socket.id === user.id && <span> (You)</span>}
              </p>
              <img
                onClick={() => {
                  if (socket.id === user.id) {
                    handlePlayerReady();
                  }
                }}
                className={`select-none mx-auto border-black border-4 rounded-xl ${socket.id === user.id ? 'cursor-pointer bg-pink-600' : 'bg-stone-700'}`} width={150} src={user.playerIcon}
              />
              <p className={`pt-2 ${socket.id === user.id ? 'font-bold' : ''}`}>{user.isReady ? "Ready" : "Not Ready"}</p>
            </li>
          ))}
        </ul>
      </div>
      {/* <button className='mt-4 p-4 rounded-md font-bold' onClick={handlePlayerReady}>{isPlayerReady ? "Waiting..." : "Ready?"}</button> */}
      <Footer />
    </div>
  );
};

export default Lobby;