'use strict';

var net = require('net'),
    users = require('./lib/users'),
    commands = require('./lib/commands');

net.createServer(function(socket) {
    // Socket settings
    socket.setKeepAlive(true);

    // Add user
    users.addUser(socket);

    // Welcome and inform user
    users.messageUser(socket, 'Welcome ' + socket.name + '\n');
    users.messageUser(socket, 'To change your name simply type: /name myNickBrah\n');

    users.messageUsers(socket.name + ' joined the chat\n');

    socket.on('data', function (data) {
        if (commands.exists(data, '/name ')) {
            users.changeUserName(socket, data);

            return;
        }

        users.messageUsers(socket.name + ' > ' + data);
    });

    // Remove the client from the list when it leaves
    socket.on('end', function () {
        users.removeUser(socket);

        users.messageUsers(socket.name + ' left the chat.\n');
    });
}).listen(5000);

// Put a friendly message on the terminal of the server.
console.log('Chat server running at port 5000\n');
