import React, { useEffect, useState } from 'react';

function PostGame({ socket, roomName }) {
  const [finalUsers, setFinalUsers] = useState([]);
  const [countdown, setCountdown] = useState(10); // Initial countdown time in seconds

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
        // When the countdown reaches 0, reload the page
        clearInterval(timer); // Stop the countdown timer
        window.location.reload();
      }
    }, 1000); // Update the countdown every second

    return () => {
      // Clear the countdown timer when the component unmounts to avoid memory leaks
      clearInterval(timer);
    };
  }, [roomName, countdown]);

  return (
    <div className='flex flex-col items-center'>
        <div>
          <h2 className='text-xl mt-5'>Postgame: Nearly_Dreamy_Tate_545</h2>
          <p className='text-center'>Countdown: {countdown} seconds</p>
        </div>
        <div className='flex'>
          <ul className='sm:grid sm:grid-cols-2 gap-7 mt-5'>
            {finalUsers.map((user) => (
              <li className='text-center' key={user.id}>
                <p>{user.userName}</p>
                <p>{user.score}</p>
              </li>
            ))}
          </ul>
        </div>
    </div>
  );
}

export default PostGame;
