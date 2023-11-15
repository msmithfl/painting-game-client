import React from 'react';

function Lobby({roomName, userList, isPlayerReady, handlePlayerReady, socket}) {

  return (
    <div className='flex flex-col items-center'>
      <div>
        <h2 className='text-xl mt-5'>Lobby: {roomName}</h2>
      </div>
      <div className='flex'>
        <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-5'>
          {userList.map((user) => (
            <li className='text-center mt-5 sm:mt-0' key={user.id}>
              <p className={`${socket.id === user.id ? 'font-bold' : ''}`}>
                {user.userName}
                {socket.id === user.id && <span> (You)</span>}
              </p>
              <img
                onClick={() => {
                  if (socket.id === user.id) {
                    handlePlayerReady();
                  }
                }}
                className={`mx-auto ${socket.id === user.id ? 'cursor-pointer' : ''}`} width={150} src={user.playerIcon}/>
              {user.isReady ? <p>Ready</p> : <p>Not Ready</p>}
            </li>
          ))}
        </ul>
      </div>
        <button className='mt-4 p-4 rounded-md font-bold' onClick={handlePlayerReady}>{isPlayerReady ? "Waiting..." : "Ready?"}</button>
    </div>
  );
};

export default Lobby;