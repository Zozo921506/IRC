const express = require('express');
const app = express();
const PORT = 4000;
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }
});

const channels = new Set();

io.on("connection", (socket) => {
  socket.on("send_message", (data) => {
    const { message, username, nickname } = data;
    io.emit("receive_message", { message, username, nickname });
  });

  socket.on("send_message_nickname", (data) => {
    const { message, nickname } = data;
    io.emit("receive_message_nickname", { message, nickname });
  });

  socket.on("disconnect", (data) => {
    console.log("An user logged out");
  });

  socket.on("send_message_room", (data) => {
    const { message, username, channel } = data;
    io.to(channel).emit("receive_message_room", { message, username });
  });

  socket.on("send_message_room_nickname", (data) => {
    const { message, channel, nickname } = data;
    io.to(channel).emit("receive_message_room_nickname", { message, nickname });
  });

  socket.on("user_login", (data) => {
    const { username, id } = data;
    console.log(data.username + " has logged in.")
    io.emit("user_login", { username, id });
  });

  socket.on("update_username", (data) => {
    const { username, updateUsername } = data;
    io.emit("update_username", { username, updateUsername });
  });

  socket.on('create', (data) => {
    const { channel, id } = data;
    if (!channels.has(channel)) 
    {
      channels.add(channel);
      io.emit("create", { channel, id });
    }
  });

  socket.on('join', (data) => {
    const { username, channel, id } = data;
    socket.join(channel);
    io.to(channel).emit("join", { username, id });
  });

  socket.on('join_nickname', (data) => {
    const { nickname, channel } = data;
    socket.join(channel);
    io.to(channel).emit("join_nickname", { nickname });
  });

  socket.on('leave', (data) => {
    const { username, channel } = data;
    socket.leave(channel);
    io.to(channel).emit("leave", { username });
  });

  socket.on('leave_nickname', (data) => {
    const { nickname, channel } = data;
    socket.leave(channel);
    io.to(channel).emit("leave_nickname", { nickname });
  });

  socket.on('nickname', (data) => {
    const { username, nickname } = data;
    io.emit("nickname", { username, nickname })
  });

  socket.on('list', () => {
    socket.emit('list', Array.from(channels));
  })

  socket.on('delete', (data) => {
    const { channel } = data;
    if (channels.has(channel)) 
    {
      channels.delete(channel);
      io.in(channel).socketsLeave(channel);
      io.emit('delete', { channel });
    }
  });
});

server.listen(4000, () => {
  console.log("Server is running on port 4000");
});
