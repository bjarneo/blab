/* jslint node: true */
'use strict';

var net = require('net'),
    Welcome = require('./lib/welcome'),
    Users = require('./lib/users'),
    Utils = require('./lib/utilities');

net.createServer(function (socket) {
    // Send message to clients
    function broadcast(message) {
        Utils.each(Users.getUsers(), function(user) {
            user.write(message);
        });

        // server output
        process.stdout.write(message);
    }

    // Socket settings
    socket.setKeepAlive(true);

    // Add user
    Users.addUser(socket);

    // Welcome user
    Welcome.ahouy(socket);

    broadcast(socket.name + ' joined the chat\n');

    socket.on('data', function (data) {
        if (Utils.contains(data, '/name ') !== -1) {
            Users.changeUserName(socket, data, broadcast);

            return;
        }

        broadcast(socket.name + ' > ' + data);
    });

    // Remove the client from the list when it leaves
    socket.on('end', function () {
        Users.removeUser(socket);

        broadcast(socket.name + ' left the chat.\n');
    });
}).listen(5000);

// Put a friendly message on the terminal of the server.
console.log('Chat server running at port 5000\n');
