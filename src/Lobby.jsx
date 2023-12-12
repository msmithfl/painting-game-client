import React from 'react';
import QRCode from 'react-qr-code';
import Footer from './Footer';

function Lobby({roomName, userList, isPlayerReady, handlePlayerReady, socket}) {
  const qrCodeURL = `https://painting-game-client.onrender.com${location.pathname}`;
  const [copySuccess, setCopySuccess] = React.useState(false);

  const copyURLToClipboard = () => {
    navigator.clipboard.writeText(qrCodeURL)
      .then(() => {
        setCopySuccess(true); // Set state to true on successful copy
        setTimeout(() => {
          setCopySuccess(false); // Reset success state after a short delay
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy URL to clipboard:', err);
      });
  };
  // getting user
  const currentUser = userList.find(user => user.id === socket.id);
  // getting all other users
  const filteredUserList = userList.filter(user => user.id !== socket.id);

  return (
    <div className='flex flex-col items-center relative'>
      <div className='flex flex-col items-center'>
        <h2 className='text-xl mt-5'>Lobby: {roomName}</h2>
        <QRCode className='pt-5 cursor-pointer' value={qrCodeURL} onClick={copyURLToClipboard} />
        {copySuccess && (
          <p className="text-green-500 absolute top-5 z-10 bg-white py-2 px-4 rounded-md">
            URL copied!
          </p>
        )}
        <h1 className='text-2xl font-bold pt-5'>Tap <span className='text-pink-600'>Your Icon</span> When Ready!</h1>
      </div>
      <div className='flex'>
        <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-2'>
          {currentUser && (
              <li className='select-none text-center mt-5 sm:mt-0' key={currentUser.id}>
              <p className='pb-2 font-bold'>{currentUser.userName} (You)</p>
              <img
                onClick={handlePlayerReady}
                className='select-none mx-auto border-black border-4 rounded-xl cursor-pointer bg-pink-600'
                width={150}
                src={currentUser.playerIcon}
              />
              <p className='pt-2 font-bold'>{currentUser.isReady ? "Ready" : "Not Ready"}</p>
            </li>
          )}
          {filteredUserList.map((user) => (
            <li className='select-none text-center mt-5 sm:mt-0' key={user.id}>
              <p className='pb-2'>{user.userName}</p>
              <img
                className='select-none mx-auto border-black border-4 rounded-xl bg-stone-700'
                width={150}
                src={user.playerIcon}
              />
              <p className='pt-2'>{user.isReady ? "Ready" : "Not Ready"}</p>
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