import React from 'react'

function Lobby({roomName, userList, isPlayerReady, handlePlayerReady}) {
  return (
    <div className='flex flex-col items-center'>
      <div>
        <h2 className='text-xl mt-5'>Lobby: {roomName}</h2>
      </div>
      <div className='flex'>
        <ul className='sm:grid sm:grid-cols-2'>
          {userList.map((user) => (
            <li className='m-4 text-center' key={user.id}>{user.userName}{user.isReady ? <p>Ready</p> : <p>Not Ready</p>}</li>
          ))}
        </ul>
      </div>
        <button onClick={handlePlayerReady}>{isPlayerReady ? "Waiting..." : "Ready?"}</button>
    </div>
  )
}

export default Lobby