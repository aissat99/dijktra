const serverSocket = require('socket.io')();

// Define a connection event
serverSocket.on('connection', (socket) => {
    console.log('A user connected');

    // Define event handlers
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Listen for incoming connections
const PORT = 3000;
serverSocket.listen(PORT);
console.log(`Socket.IO server listening on port ${PORT}`);
