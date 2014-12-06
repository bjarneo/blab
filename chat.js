'use strict';

var net = require('net'),
    users = require('./lib/users'),
    commands = require('./lib/commands');

net.createServer(function (socket) {
    // Socket settings
    socket.setKeepAlive(true);

    // Set socket
    users.setSocket(socket);

    // Add user
    users.addUser();

    // Welcome and inform user
    users.messageUser('Welcome ' + socket.name + '\n');
    users.messageUser('Type /help for commands\n');

    users.messageUsers(socket.name + ' joined the chat\n');

    // Handle data
    socket.on('data', function (data) {
        users.setData(data);

        if (commands.exists(data, '/name')) {
            users.changeUserName();

            return;
        } else if (commands.exists(data, '/exit')) {
            users.removeUser();

            socket.end();

            return;
        } else if (commands.exists(data, '/help')) {
            users.messageUser(' * /name newName\n * /exit (for exit)\n');

            return;
        }

        users.messageUsers(socket.name + ' > ' + data);
    });

    // Remove the client from the list when it leaves
    socket.on('end', function () {
        users.removeUser();

        users.messageUsers(socket.name + ' left the chat.\n');
    });
}).listen(5000);

// Put a friendly message on the terminal of the server.
console.log('Chat server running at port 5000\n');
