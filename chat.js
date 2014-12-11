'use strict';

var net = require('net'),
    userModule = require('./lib/user'),
    commands = require('./lib/commands');

net.createServer(function (socket) {
    var user = null;

    // Socket settings
    socket.setKeepAlive(true);

    // Add user
    user = new userModule(socket);

    // Welcome and inform user
    user.messageUser('Welcome ' + socket.name + '');
    user.messageUser('Type /help for commands');

    user.messageUsers(socket.name + ' joined the chat\n');

    // Handle data
    socket.on('data', function (data) {
        user.setData(data);

        if (commands.exists(data, '/name')) {
            user.changeUserName();

            return;
        } else if (commands.exists(data, '/exit')) {
            user.removeUser();

            socket.end();

            return;
        } else if (commands.exists(data, '/help')) {
            user.messageUser(' * /name newName\n * /exit (for exit)');

            return;
        } else {
            user.messageUsers(socket.name + ' > ' + data);
        }
    });

    // Remove the client from the list when it leaves
    socket.on('end', function () {
        user.removeUser();

        user.messageUsers(socket.name + ' left the chat.');
    });
}).listen(5000);

// Put a friendly message on the terminal of the server.
console.log('Chat server running at port 5000\n');
