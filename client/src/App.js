import io from 'socket.io-client';
import "./App.css";
import { useEffect, useState } from "react";
const socket = io.connect('http://localhost:4000');

function App() {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [logged, setLogged] = useState(false);
  const [updateUsername, setUpdateUsername] = useState("");
  const [channel, setChannel] = useState("");
  const [room, setRoom] = useState(false);
  const [nickname, setNickname] = useState("");
  const [tmpNickname, setTmpNickname] = useState("");
  const [channels, setChannels] = useState([]);
  const [idChannel, setIdChannel] = useState("");
  const id = socket.id;

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.startsWith("/nick "))
    {
      const cmdNickname = message.split("/nick ")[1];
      nick_cmd(cmdNickname);
      setMessage("");
    }
    else if (message.startsWith("/create "))
    {
      const cmdCreate = message.split("/create ")[1];
      join_cmd(cmdCreate);
      setMessage("");
    }
    else if (message.startsWith("/join "))
    {
      const cmdCreate = message.split("/join ")[1];
      join_cmd(cmdCreate);
      setMessage("");
    }
    else
    {
      if (logged) 
      {
        socket.emit("send_message", { message, username });
        setMessage("");
      } 
      else 
      {
        alert("Please log in with a username before sending messages.");
      }
    }
  }

  const sendMessage_nickname = (e) => {
    e.preventDefault();
    if (message.startsWith("/nick "))
    {
      const cmdNickname = message.split("/nick ")[1];
      nick_cmd(cmdNickname);
      setMessage("");
    }
    else if (message.startsWith("/create "))
    {
      const cmdCreate = message.split("/create ")[1];
      join_nickname_cmd(cmdCreate);
      setMessage("");
    }
    else if (message.startsWith("/join "))
    {
      const cmdCreate = message.split("/join ")[1];
      join_nickname_cmd(cmdCreate);
      setMessage("");
    }
    else
    {
      if (logged) 
      {
        socket.emit("send_message_nickname", { message, nickname });
        setMessage("");
      } 
      else 
      {
        alert("Please log in with a username before sending messages.");
      }
    }
  }

  const sendMessageRoom = (e) => {
    e.preventDefault();
    if (message.startsWith("/nick "))
    {
      const cmdNickname = message.split("/nick ")[1];
      nick_cmd(cmdNickname);
      setMessage("");
    }
    else if (message.startsWith("/leave"))
    {
      leave_cmd();
      setMessage("");
    }
    else if (message.startsWith("/delete"))
    {
      deleteChannel_cmd();
      setMessage("");
    }
    else
    {
      if (logged && room) 
      {
        socket.emit("send_message_room", { message, username, channel, nickname });
        setMessage("");
      } 
      else 
      {
        alert("Please log in and join a room before sending messages.");
      }
    }
  }

  const sendMessageRoom_nickname = (e) => {
    e.preventDefault();
    if (message.startsWith("/nick"))
    {
      const cmdNickname = message.split("/nick ")[1];
      nick_cmd(cmdNickname);
      setMessage("");
    }
    else if (message.startsWith("/leave"))
    {
      leave_nickname_cmd();
      setMessage("");
    }
    else if (message.startsWith("/delete"))
    {
      deleteChannel_cmd();
      setMessage("");
    }
    else
    {
      if (logged && room) 
      {
        socket.emit("send_message_room_nickname", { message, channel, nickname });
        setMessage("");
      } 
      else 
      {
        alert("Please log in and join a room before sending messages.");
      }
    }
  }

  const login = (e) => {
    e.preventDefault();
    if (username) 
    {
      setLogged(true);
      socket.emit("user_login", { username, id });
      getChannels();
    } 
    else 
    {
      alert("Please enter a username to log in.");
    }
  }

  const update = (e) => {
    e.preventDefault();
    if (updateUsername) 
    {
      if (updateUsername !== username) 
      {
        setUsername(updateUsername);
        socket.emit("update_username", { username, updateUsername });
        setUpdateUsername("");
      } 
      else 
      {
        alert("You already use this username");
        setUpdateUsername("");
      }
    } 
    else 
    {
      alert("Please enter a username to update it.");
    }
  }

  const join = (e) => {
    e.preventDefault();
    if (channel) 
    {
      socket.emit("create", { channel, id });
      socket.emit("join", { username, channel, id });
      setRoom(true);
    }
  }

  const join_cmd = (cmd) => {
    if (cmd) 
    {
      socket.emit("create", { channel: cmd, id });
      socket.emit("join", { username, channel: cmd, id });
      setRoom(true);
    }
  }

  const join_nickname = (e) => {
    e.preventDefault();
    if (channel) 
    {
      socket.emit("create", { channel, id });
      socket.emit("join_nickname", { nickname, channel, id });
      setRoom(true);
    }
  }

  const join_nickname_cmd = (cmd) => {
    if (cmd) 
    {
      socket.emit("create", { channel: cmd, id });
      socket.emit("join_nickname", { nickname, channel: cmd, id });
      setRoom(true);
    }
  }

  const leave = (e) => {
    e.preventDefault();
    socket.emit("leave", { username, channel });
    setRoom(false);
  }

  const leave_cmd = () => {
    socket.emit("leave", { username, channel });
    setRoom(false);
  }

  const leave_nickname = (e) => {
    e.preventDefault();
    socket.emit("leave_nickname", { nickname, channel });
    setRoom(false);
  }

  const leave_nickname_cmd = () => {
    socket.emit("leave_nickname", { nickname, channel });
    setRoom(false);
  }

  const nick = (e) => {
    e.preventDefault();
    if (tmpNickname) 
    {
      if (tmpNickname !== nickname) 
      {
        setNickname(tmpNickname);
        console.log(nickname);
        socket.emit("nickname", { username, nickname: tmpNickname });
        setTmpNickname("");
      } 
      else 
      {
        alert("You already use this nickname");
      }
    }
    else 
    {
      alert("Please enter a valid nickname");
    }
  }

  const nick_cmd = (cmd) => {
    if (cmd) 
    {
      if (cmd !== nickname) 
      {
        setNickname(cmd);
        socket.emit("nickname", { username, nickname: cmd });
      } 
      else 
      {
        alert("You already use this nickname");
      }
    } 
    else 
    {
      alert("Please enter a valid nickname");
    }
  }

  const getChannels = () => {
    socket.emit('list');
  }

  const deleteChannel = (e) => {
    e.preventDefault();
    socket.emit('delete', { channel });
    setRoom(false);
  }

  const deleteChannel_cmd = () => {
    socket.emit('delete', { channel });
    setRoom(false);
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      document.querySelector("#messages").innerHTML += `<li><strong>${data.username}:</strong> ${data.message}</li>`;
      window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on("receive_message_nickname", (data) => {
      document.querySelector("#messages").innerHTML += `<li><strong>${data.nickname}:</strong> ${data.message}</li>`;
      window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on("receive_message_room", (data) => {
      document.querySelector("#messages").innerHTML += `<li><strong>${data.username}:</strong> ${data.message}</li>`;
      window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on("receive_message_room_nickname", (data) => {
      document.querySelector("#messages").innerHTML += `<li><strong>${data.nickname}:</strong> ${data.message}</li>`;
      window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on("user_login", (data) => {
      document.querySelector("#messages").innerHTML += `<h5 class='blue'><strong>Welcome to ${data.username}!</strong></h5>`;
    });

    socket.on("update_username", (data) => {
      document.querySelector("#messages").innerHTML += `<h5><strong>The user ${data.username} changed their username to ${data.updateUsername}</strong></h5>`;
    });

    socket.on("create", (data) => {
      setIdChannel(data.id);
      document.querySelector('#messages').innerHTML += `<h5 class='green'><strong>The channel ${data.channel} is now open</strong></h5>`;
    });

    socket.on("join", (data) => {
      document.querySelector('#messages').innerHTML += `<h5 class='blue'><strong>${data.username} has joined the room</strong></h5>`;
      console.log(data);
    });

    socket.on("join_nickname", (data) => {
      document.querySelector('#messages').innerHTML += `<h5 class='blue'><strong>${data.nickname} has joined the room</strong></h5>`;
    });

    socket.on("leave", (data) => {
      document.querySelector('#messages').innerHTML += `<h5 class='orange'><strong>${data.username} has left the room</strong></h5>`;
    });

    socket.on("leave_nickname", (data) => {
      document.querySelector('#messages').innerHTML += `<h5 class='orange'><strong>${data.nickname} has left the room</strong></h5>`;
    });

    socket.on("nickname", (data) => {
      document.querySelector("#messages").innerHTML += `<h5 class='purple'><strong>The user ${data.username} decide to use ${data.nickname} as a nickname</strong></h5>`;
    });

    socket.on('list', (data) => {
      setChannels(data);
    });

    socket.on("delete", (data) => {
      document.querySelector('#messages').innerHTML += `<h5 class='red'><strong>The channel ${data.channel} has been destroyed`;
    })

    return () => {
      socket.off("receive_message");
      socket.off("receive_message_room");
      socket.off("user_login");
      socket.off("update_username");
      socket.off("create");
      socket.off("join");
      socket.off("leave");
      socket.off("nickname");
      socket.off("receive_message_nickname");
      socket.off("receive_message_room_nickname");
      socket.off("join_nickname");
      socket.off("leave_nickname");
      socket.off("list");
      socket.off("delete");
    };
  }, []);

  return (
    <div className='App'>
      {!logged ? (
        <form onSubmit={login}>
          <input placeholder='Enter username' onChange={(e) => setUsername(e.target.value)} />
          <button type="submit">Login</button>
        </form>
      ) : (
        <div>
          {!room ? (
            <>
              {!nickname ? (
                <>
                  <p>Logged in as {username}</p>
                  <form onSubmit={update}>
                    <input placeholder='Modify your username' onChange={(e) => setUpdateUsername(e.target.value)} value={updateUsername} />
                    <button type="submit">Update</button>
                  </form>
                  <form onSubmit={join}>
                    <input placeholder='Join a room' onChange={(e) => setChannel(e.target.value)} />
                    <button type="submit">Join</button>
                  </form>
                  <form onSubmit={nick}>
                    <input placeholder='Enter a nickname' onChange={(e) => setTmpNickname(e.target.value)} value={tmpNickname} />
                    <button type='submit'>Nickname</button>
                  </form>
                  <button onClick={getChannels}>Channels</button>
                  <h1>Channels:</h1>
                  <ul id='channels'>
                    {channels.map((ch, index) => (
                      <li key={index}>{ch}</li>
                    ))}
                  </ul>
                  <h1>Messages:</h1>
                  <ul id='messages'></ul>
                  <form onSubmit={sendMessage} id='form'>
                    <input
                      placeholder='Message'
                      value={message}
                      onChange={(e) => setMessage(e.target.value)} id='input'
                    />
                    <button type="submit">Send Message</button>
                  </form>
                </>
              ) : (
                <>
                  <p>Logged in as {username}</p>
                  <form onSubmit={update}>
                    <input placeholder='Modify your username' onChange={(e) => setUpdateUsername(e.target.value)} value={updateUsername} />
                    <button type="submit">Update</button>
                  </form>
                  <form onSubmit={join_nickname}>
                    <input placeholder='Join a room' onChange={(e) => setChannel(e.target.value)} />
                    <button type="submit">Join</button>
                  </form>
                  <form onSubmit={nick}>
                    <input placeholder='Enter a nickname' onChange={(e) => setTmpNickname(e.target.value)} value={tmpNickname} />
                    <button type='submit'>Nickname</button>
                  </form>
                  <button onClick={getChannels}>Channels</button>
                  <h1>Channels:</h1>
                  <ul id='channels'>
                    {channels.map((ch, index) => (
                      <li key={index}>{ch}</li>
                    ))}
                  </ul>
                  <h1>Messages:</h1>
                  <ul id='messages'></ul>
                  <form onSubmit={sendMessage_nickname} id='form'>
                    <input
                      placeholder='Message'
                      value={message}
                      onChange={(e) => setMessage(e.target.value)} id='input'
                    />
                    <button type="submit">Send Message</button>
                  </form>
                </>
              )}
            </>
          ) : (
            <>
              {!nickname ? (
                <>
                {idChannel !== id ? (
                  <>
                    <p>Logged in as {username}</p>
                    <form onSubmit={update}>
                      <input placeholder='Modify your username' onChange={(e) => setUpdateUsername(e.target.value)} value={updateUsername} />
                      <button type="submit">Update</button>
                    </form>
                    <form onSubmit={nick}>
                      <input placeholder='Enter a nickname' onChange={(e) => setTmpNickname(e.target.value)} value={tmpNickname} />
                      <button type='submit'>Nickname</button>
                    </form>
                    <button onClick={leave}>Leave</button>
                    <h1>Messages:</h1>
                    <ul id='messages'></ul>
                    <form onSubmit={sendMessageRoom} id='form'>
                      <input
                        placeholder='Message'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)} id='input'
                      />
                      <button type="submit">Send Message</button>
                    </form>
                  </>
                ) : (
                  <>
                    <p>Logged in as {username}</p>
                    <form onSubmit={update}>
                      <input placeholder='Modify your username' onChange={(e) => setUpdateUsername(e.target.value)} value={updateUsername} />
                      <button type="submit">Update</button>
                    </form>
                    <form onSubmit={nick}>
                      <input placeholder='Enter a nickname' onChange={(e) => setTmpNickname(e.target.value)} value={tmpNickname} />
                      <button type='submit'>Nickname</button>
                    </form>
                    <button onClick={leave}>Leave</button>
                    <button onClick={deleteChannel}>Delete Channel</button>
                    <h1>Messages:</h1>
                    <ul id='messages'></ul>
                    <form onSubmit={sendMessageRoom} id='form'>
                      <input
                        placeholder='Message'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)} id='input'
                      />
                      <button type="submit">Send Message</button>
                    </form>
                  </>
                )}
                </>
              ) : (
                <>
                  {idChannel !== id ? (
                    <>
                      <p>Logged in as {username}</p>
                      <form onSubmit={update}>
                        <input placeholder='Modify your username' onChange={(e) => setUpdateUsername(e.target.value)} value={updateUsername} />
                        <button type="submit">Update</button>
                      </form>
                      <form onSubmit={nick}>
                        <input placeholder='Enter a nickname' onChange={(e) => setTmpNickname(e.target.value)} value={tmpNickname} />
                        <button type='submit'>Nickname</button>
                      </form>
                      <button onClick={leave_nickname}>Leave</button>
                      <h1>Messages:</h1>
                      <ul id='messages'></ul>
                      <form onSubmit={sendMessageRoom_nickname} id='form'>
                        <input
                          placeholder='Message'
                          value={message}
                          onChange={(e) => setMessage(e.target.value)} id='input'
                        />
                        <button type="submit">Send Message</button>
                      </form>
                    </>
                  ) : (
                    <>
                      <p>Logged in as {username}</p>
                      <form onSubmit={update}>
                        <input placeholder='Modify your username' onChange={(e) => setUpdateUsername(e.target.value)} value={updateUsername} />
                        <button type="submit">Update</button>
                      </form>
                      <form onSubmit={nick}>
                        <input placeholder='Enter a nickname' onChange={(e) => setTmpNickname(e.target.value)} value={tmpNickname} />
                        <button type='submit'>Nickname</button>
                      </form>
                      <button onClick={leave_nickname}>Leave</button>
                      <button onClick={deleteChannel}>Delete Channel</button>
                      <h1>Messages:</h1>
                      <ul id='messages'></ul>
                      <form onSubmit={sendMessageRoom_nickname} id='form'>
                        <input
                          placeholder='Message'
                          value={message}
                          onChange={(e) => setMessage(e.target.value)} id='input'
                        />
                        <button type="submit">Send Message</button>
                      </form>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
