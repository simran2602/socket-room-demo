const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on("connection", (socket) => {
    console.log("a user is connected");
    // console.log("socket is =>", socket);

    socket.on('joinRoom', (room) => {
        socket.join(room)
        console.log(`a user joined the room ${room}`);
    });

    socket.on('leaveRoom', (room) => {
        socket.leave(room);
        console.log(`User left room: ${room}`);
    });

    socket.on("chatMessage", (data) => {
        const { room, message } = data;
        io.to(room).emit('chatMessage', message)
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});