/* jslint node: true */
'use strict';

var net = require('net'),
    welcome = require('./lib/welcome'),
    users = require('./lib/users'),
    utils = require('./lib/utilities');

net.createServer(function (socket) {
    // Send message to clients
    function broadcast(message) {
        utils.each(users.getUsers(), function(user) {
            user.write(message);
        });

        // server output
        process.stdout.write(message);
    }

    // Socket settings
    socket.setKeepAlive(true);

    // Add user
    users.addUser(socket);

    // Welcome user
    welcome.ahouy(socket);

    broadcast(socket.name + ' joined the chat\n');

    socket.on('data', function (data) {
        if (utils.contains(data, '/name ') !== -1) {
            users.changeUserName(socket, data, broadcast);

            return;
        }

        broadcast(socket.name + ' > ' + data);
    });

    // Remove the client from the list when it leaves
    socket.on('end', function () {
        users.removeUser(socket);

        broadcast(socket.name + ' left the chat.\n');
    });
}).listen(5000);

// Put a friendly message on the terminal of the server.
console.log('Chat server running at port 5000\n');
